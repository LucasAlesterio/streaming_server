import express from "express";
import fs from "fs";
import { resolve } from "path";

const app = express();

app.get("/stream", (req, res) => {
    const { range } = req.headers;
    const videoPath = resolve(__dirname, "../videos", "test.mp4");
    const videoSize = fs.statSync(videoPath).size;

    const start = Number(range?.replace(/\D/g, ""));
    const chunkSize = 50000;
    const end = Math.min(start + chunkSize, videoSize - 1);

    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    const videoStream = fs.createReadStream(videoPath, {
        start,
        end,
    });
    videoStream.pipe(res);
});
app.listen(3333, () => {
    console.log("server started on port 3333 🚀");
});
