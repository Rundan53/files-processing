const { createReadStream } = require("node:fs");

module.exports = async (req, res, next) => {
  const { fileTypeFromBuffer, fileTypeFromStream } = await import("file-type");
  //   const stream = createReadStream(req.file);
  console.log(req.file);
  console.log(await fileTypeFromBuffer(req.file.buffer));
  next();
  //=> {ext: 'mp4', mime: 'video/mp4'}
};
