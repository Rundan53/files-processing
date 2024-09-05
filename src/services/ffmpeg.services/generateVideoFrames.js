const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

const config = require("../../config/config");

const { isMainThread, workerData, parentPort } = require("worker_threads");
const path = require("path");
const fs = require("fs");
const { template, serverUrl } = workerData;

ffmpeg.setFfmpegPath(ffmpegPath);

const generateVideoFrames = async ({ template, serverUrl }) => {
  const outputFolder = path.join(
    __dirname,
    "..",
    "..",
    "public",
    "images",
    `${template._id}`,
  );

  if (!fs.existsSync(outputFolder)) {
    // Create the folder if it doesn't exist
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const outputFilePath = path.join(outputFolder, "frame_%04d.jpg");

  return new Promise((resolve, reject) => {
    ffmpeg(template.templateURL)
      .outputOptions(["-vf", `fps=1/${config.videoFrameInterval},scale=320:-1`])
      .output(outputFilePath)
      .on("end", () => {
        const outputPaths = [];
        const frameFiles = fs
          .readdirSync(outputFolder)
          .filter((file) => file.startsWith("frame"));

        frameFiles.forEach((file) => {
          outputPaths.push(`${serverUrl}/images/${template._id}/${file}`);
        });

        resolve(outputPaths);
      })
      .on("error", (err) => {
        console.error("Error: ", err.message);
        reject(err.message);
      })
      .run();
  });
};

if (!isMainThread) {
  (async () => {
    try {
      const response = await generateVideoFrames({ template, serverUrl });
      parentPort.postMessage(response);
    } catch (error) {
      parentPort.postMessage({ type: "error", error: error.message });
    }
  })();
}
