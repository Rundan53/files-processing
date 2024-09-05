module.exports = {
  port: process.env.PORT,
  mongoConnectionURI: process.env.MONGODB_URI,
  inviteEmail: process.env.INVITE_EMAIL,
  firstToRegister: process.env.FIRST_LEADER_EMAIL,
  frontendOrigin: process.env.FRONTEND_ORIGIN,

  //s3 config
  bucketName: process.env.S3_BUCKET_NAME,
  awsIamUserKey: process.env.IAM_USER_KEY,
  awsIamSecret: process.env.IAM_USER_SECRET,

  videoFrameInterval: process.env.VIDEO_FRAME_INTERVAL || 3,
  // videoFrameInterval: 3,
};

// start-point = duration / frames
