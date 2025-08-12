import express from "express";
import ytdl from "ytdl-core";

const app = express();

// Home route
app.get("/", (req, res) => {
  res.send("✅ YouTube Audio API Working!");
});

// YouTube audio route
app.get("/ytaudio", async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ error: "Missing YouTube video ID" });

    const url = `https://www.youtube.com/watch?v=${id}`;
    const info = await ytdl.getInfo(url);

    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "highestaudio" });
    res.json({
      title: info.videoDetails.title,
      author: info.videoDetails.author.name,
      lengthSeconds: info.videoDetails.lengthSeconds,
      audioUrl: audioFormat.url
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Export app for Vercel
export default app;
