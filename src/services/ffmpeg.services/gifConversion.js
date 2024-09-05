const { workerData } = require("worker_threads");

const ffmpeg = require("fluent-ffmpeg");

const ffprobePath = require("ffprobe-static").path;
const ffmpegPath = require("ffmpeg-static");

const path = require("path");
const { PassThrough } = require("stream");
const fs = require("fs/promises");
const streamUploadsToS3 = require("../../thirdParty/s3upload");

//setting static paths to ffmpeg and ffprobe
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

//setting static paths to ffmpeg/ffprobe explicitly (if above doesn't work)
// ffmpeg.setFfmpegPath("D:\\ffmpeg\\bin\\ffmpeg.exe");
// ffmpeg.setFfprobePath("D:\\ffmpeg\\bin\\ffprobe.exe");

//gives files name without extension
function getSubstringAfterLastBackslash(str) {
  //last occurrence of the backslash
  const lastIndex = str.lastIndexOf("/");
  if (lastIndex === -1) {
    return str;
  }
  const videoNameString = lastIndex === -1 ? str : str.substring(lastIndex + 1);
  const dotIndex = videoNameString.lastIndexOf(".");

  // Return the requierd gif name
  return videoNameString.substring(0, dotIndex);
}

async function processVideoToGif(videoURL) {
  try {
    //edge case if the video duration is too short
    const { size, durationInSeconds: videoDurationInSecs } =
      await getVideoMetadata(videoURL);
    console.log(`Size: ${size}, Duration: ${videoDurationInSecs} seconds`);

    const gifDuration = videoDurationInSecs > 5 ? 5 : videoDurationInSecs;
    console.log(gifDuration);

    // Define input and output file paths
    const inputFilePath = videoURL;
    const palettePath = path.join(__dirname, "palette.png");

    // Generate the palette for better GIF quality
    await generatePallete({ palettePath, inputFilePath, gifDuration });

    // Create the GIF using the generated palette and stream it to s3
    const passThroughStream = new PassThrough();

    const [, fileData] = await Promise.all([
      generateGif({
        inputFilePath,
        palettePath,
        gifDuration,
        passThroughStream,
      }),
      streamUploadsToS3({
        passThroughStream,
        key: `videoGifs/${getSubstringAfterLastBackslash(inputFilePath)}.gif`,
        contentType: "image/gif",
      }),
    ]);

    if (fileData) {
      console.log("gif file uplaoded sucafkaefoapfma afwasfkmjawkfwkef");
      fs.unlink(palettePath);

      // fileData.videoDurationInSecs = videoDurationInSecs;
      return fileData;
    }
  } catch (error) {
    console.error("Error getting video info:", error);
  }
}

//size and duration of vieo for gif conversion
function getVideoMetadata(inputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
      if (error) {
        return reject(error);
      }

      const { duration, size } = videoInfo.format;
      return resolve({
        size,
        durationInSeconds: Math.floor(duration),
      });
    });
  });
}

//color palette for enhanced gif
function generatePallete({ palettePath, inputFilePath, gifDuration }) {
  console.log("inside palette generation");
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .setStartTime("00:00:00") // time fromm which video gif would start
      .setDuration(gifDuration) // Duration of the GIF
      .output(palettePath) //RGB used in enhancing gif
      .complexFilter(["fps=10,scale=360:-1:flags=lanczos,palettegen"]) //pallete generation
      .on("end", resolve) //successfull palette generation
      .on("error", reject)
      .run();
  });
}

function generateGif({
  inputFilePath,
  palettePath,
  gifDuration,
  passThroughStream,
}) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .setStartTime("00:00:00") // Start time at the beginning of the video
      .setDuration(gifDuration) // Duration of the GIF
      .outputFormat("gif")
      .complexFilter([
        `fps=10,scale=360:-1:flags=lanczos [x]; [x][1:v] paletteuse`,
      ])
      .input(palettePath)
      .on("start", (commandLine) => {
        console.log("Spawned FFmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", resolve)
      .on("error", (err, stdout, stderr) => {
        console.error("Error occurred: " + err.message);
        console.error("ffmpeg stdout: " + stdout);
        console.error("ffmpeg stderr: " + stderr);
        reject(err);
      })
      .pipe(passThroughStream, { end: true });
  });
}

module.exports = processVideoToGif;
