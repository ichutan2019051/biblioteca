const model = require('../model/user.model');

async function findWithUser(user) {
  return await model.findOne({ userName: user });
}

async function createUser(user) {
  const newUser = new model(user);
  return await newUser.save();
}

module.exports = {
  findWithUser,
  createUser,
};
