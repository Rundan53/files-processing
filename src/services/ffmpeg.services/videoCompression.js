const gifConversion = require("./gifConversion");
const { isMainThread, workerData, parentPort } = require("worker_threads");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { PassThrough } = require("stream");
const streamUploadsToS3 = require("../../thirdParty/s3upload");

// Setting static path to ffmpeg
ffmpeg.setFfmpegPath(ffmpegPath);

const s3FileUrl = workerData.fileURL; // Public URL (from the parent port)

//gives file name based on file url with extension
function getSubstringAfterLastBackslash(str) {
  const lastIndex = str.lastIndexOf("/");
  if (lastIndex === -1) {
    return str;
  }
  const videoNameString = str.substring(lastIndex + 1);
  return videoNameString;
}

//spawned the process of compression through ffmpeg
function fileCompression(inputFilePath, passThroughStream) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .videoCodec("libx264")
      .audioCodec("aac")
      .outputOptions([
        "-preset slow",
        "-crf 22",
        "-b:v 1000k",
        "-maxrate 1000k",
        "-bufsize 2000k",
        "-vf scale=-2:720",
        "-profile:v high",
        "-level 4.0",
        "-movflags +faststart",
        "-movflags frag_keyframe+empty_moov",
      ])
      .outputFormat("mp4")
      .on("start", (commandLine) => {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + (progress.percent || 0) + "% done");
      })
      .on("end", () => {
        console.log("File has been compressed successfully");
        passThroughStream.end(); // Ensure the passThroughStream is properly closed
        resolve();
      })
      .on("error", (err, stdout, stderr) => {
        console.error("Error during compression:", err.message);
        console.error("ffmpeg stdout:", stdout);
        console.error("ffmpeg stderr:", stderr);
        reject(new Error(`ffmpeg exited with code ${err.code}: ${stderr}`));
      })
      .pipe(passThroughStream, { end: true });
  });
}

//compress video file and uploads to aws s3
async function processTheCompression({ inputFilePath: s3FileUrl }) {
  try {
    console.log({ s3FileUrl });
    // Start compression
    const passThroughStream = new PassThrough();
    const [, fileData] = await Promise.all([
      fileCompression(s3FileUrl, passThroughStream),
      streamUploadsToS3({
        passThroughStream,
        key: `compressed/${getSubstringAfterLastBackslash(s3FileUrl)}`,
        contentType: "video/mp4",
      }),
    ]);
    console.log(fileData);
    return fileData;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//if Spawned thread, only then proceed to compress and gif conversion
if (!isMainThread) {
  (async () => {
    try {
      const response = await Promise.all([
        processTheCompression({ inputFilePath: s3FileUrl }),
        gifConversion(s3FileUrl),
      ]);
      console.log(response);
      parentPort.postMessage(response);
    } catch (error) {
      console.log(error); //send error to parent port (maim thread)
      parentPort.postMessage({ type: "error", error: error.message });
    }
  })();
}
