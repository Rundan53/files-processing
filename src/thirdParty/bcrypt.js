const bcrypt = require("bcryptjs");

const hashPayload = async (payload) => {
  const saltRounds = 10;

  const salt = await bcrypt.genSalt(saltRounds);

  const hashedPayload = await bcrypt.hash(payload, salt);

  return hashedPayload;
};

const compareHash = async (hashedPayload, payload) => {
  const doPayloadsMatch = await bcrypt.compare(payload, hashedPayload);

  return doPayloadsMatch;
};

module.exports = {
  hashPayload,
  compareHash,
};
