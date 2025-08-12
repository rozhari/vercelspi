const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Root route - just to check server status
app.get('/', (req, res) => {
  res.send('✅ YouTube Downloader API is running!');
});

// Download route
app.get('/download', async (req, res) => {
  const videoUrl = req.query.videoUrl;

  // Validate URL
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing videoUrl parameter' });
  }

  try {
    // Get video info
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

    if (!format) {
      return res.status(404).json({ error: 'No suitable format found' });
    }

    // Set headers for download
    res.header(
      'Content-Disposition',
      `attachment; filename="${info.videoDetails.title.replace(/[^a-z0-9]/gi, '_')}.mp4"`
    );
    res.header('Content-Type', 'video/mp4');

    // Pipe video to response
    ytdl(videoUrl, { format }).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
