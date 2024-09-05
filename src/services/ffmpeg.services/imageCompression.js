const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const { PassThrough } = require("stream");
const path = require("path");

const streamUploadsToS3 = require("../../thirdParty/s3upload");

ffmpeg.setFfmpegPath(ffmpegPath);

const compressImageFromUrl = (imageUrl, passThroughStream) => {
  return new Promise((resolve, reject) => {
    ffmpeg(imageUrl)
      .outputFormat("mjpeg")
      .outputOptions("-vf scale=iw*0.5:ih*0.5") // Example resize options
      .on("end", () => {
        console.log("Image compressed successfully");
        resolve();
      })
      .on("error", (err) => {
        console.error("Error compressing image:", err);
        reject(err);
      })
      .pipe(passThroughStream, { end: true }); // Ensure the stream ends correctly
  });
};

const processTheCompressionAndUpload = async (imageUrl) => {
  const passThroughStream = new PassThrough();

  try {
    // Start the compression and upload simultaneously
    const compressPromise = compressImageFromUrl(imageUrl, passThroughStream);
    const uploadPromise = streamUploadsToS3({
      passThroughStream,
      key: `compressedImage/123.jpg`,
      contentType: "image/jpeg",
    });

    const fileData = await uploadPromise;
    await compressPromise; // Ensure compression completes

    console.log(fileData);
    return fileData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error to ensure it propagates correctly
  }
};

module.exports = {
  processTheCompressionAndUpload,
};
