const userRepository = require("../dataAccess/user.repository");
const inviteRepository = require("../dataAccess/invite.repository");
const roleRepository = require("../dataAccess/role.repository");
const AppError = require("../utils/error");
const bcrypt = require("../thirdParty/bcrypt");
const config = require("../config/config");

const signupUser = async ({ username, email, password }) => {
  const existingUser = await userRepository.findOne({
    filter: {
      email,
    },
  });

  if (existingUser) {
    const message = "This email is already registered with another account";
    const statusCode = 400;
    throw new AppError(message, statusCode);
  }

  if (email === config.firstToRegister) {
    // get leader role id,
    const leaderRoleId = await roleRepository.findOne({
      filter: { roleTag: "TEAM_LEAD" },
    });
    const hashedPassword = await bcrypt.hashPayload(password);

    const firstToRegister = await userRepository.addNew({
      username,
      email,
      password: hashedPassword,
      roleIds: [leaderRoleId],
    });

    firstToRegister.password = undefined;
    return firstToRegister;
  }
  // const acceptedTime =
  const invitedUser = await inviteRepository.getFilteredRecords({
    filter: {
      inviteeEmail: email,
      acceptedTime: { $exists: false },
    },
  });

  if (!invitedUser || invitedUser.length <= 0) {
    const message = "You've not been invited by our Team Lead";
    const statusCode = 401;
    throw new AppError(message, statusCode);
  }

  const hashedPassword = await bcrypt.hashPayload(password);

  const roleIds = invitedUser.map((user) => user.inviteeRoleId);

  const newUser = await userRepository.addNew({
    username,
    email,
    password: hashedPassword,
    roleIds,
  });

  await inviteRepository.updateMany({
    filter: { inviteeEmail: email },
    update: {
      $set: { acceptedTime: Date.now() },
      $unset: { uuid: 1 },
    },
    options: { upsert: true },
  });

  newUser.password = undefined;

  return newUser;
};

const loginUser = async ({ email, password }) => {
  try {
    if (!email || !password) {
      throw new AppError("Email and password fields cannot be empty", 401);
    }

    const selectFields = {
      password: 1,
      username: 1,
      email: 1,
      roleIds: 1,
    };

    const populateOptions = {
      path: "roleIds",
    };

    const existingUser = await userRepository.findOne({
      filter: { email },
      selectFields,
      populateOptions,
    });

    if (!existingUser) {
      throw new AppError("Invalid email or password", 401);
    }

    const passwordsMatch = await bcrypt.compareHash(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) {
      throw new AppError("Invalid email or password", 401);
    }

    existingUser.password = undefined;

    return existingUser;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (userId) => {
  return userRepository.findById({
    id: userId,
    populateOptions: { path: "roleIds" },
  });
};

module.exports = {
  signupUser,
  loginUser,
  getUserById,
};
