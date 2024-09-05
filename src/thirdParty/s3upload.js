const AWS = require("aws-sdk");
const config = require("../config/config");

const s3Key = config.awsIamUserKey;
const s3Secret = config.awsIamSecret;
const bucketName = config.bucketName;


function streamUploadsToS3({ passThroughStream, key, contentType }) {
  try {
    console.log("inside streamGif to 23");
    console.log(s3Key, s3Secret, bucketName);
    const s3 = new AWS.S3({
      accessKeyId: s3Key,
      secretAccessKey: s3Secret,
      region: "ap-south-1",
    });

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucketName,
        ACL: "public-read",
        Key: key,
        Body: passThroughStream,
        ContentType: contentType,
      };

      const upload = s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          console.log(`File uploaded successfully. ${data.Location}`);
          resolve(data);
        }
      });

      upload.on("httpUploadProgress", (progress) => {
        console.log(`Uploaded ${progress.loaded} of ${progress.total} bytes`);
      });
    });
  } catch (error) {
    console.error(error.message);
  }
}

module.exports = streamUploadsToS3;
