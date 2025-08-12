const express = require('express');
const ytdl = require('ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/download', async (req, res) => {
  const videoUrl = req.query.videoUrl;
  if (!videoUrl || !ytdl.validateURL(videoUrl)) {
    return res.status(400).json({ error: 'Invalid or missing videoUrl parameter' });
  }

  try {
    const info = await ytdl.getInfo(videoUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
    if (!format) {
      return res.status(404).json({ error: 'No suitable format found' });
    }

    res.header('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp4"`);
    res.header('Content-Type', 'video/mp4');
    ytdl(videoUrl, { format }).pipe(res);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
