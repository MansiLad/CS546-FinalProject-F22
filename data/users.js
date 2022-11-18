const helper = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { dbConnection, closeConnection } = require("../config/mongoConnection");

// function for creating a user validations are left
const createUser = async (
  firstName,
  lastName,
  gender,
  email,
  city,
  state,
  phoneNumber,
  password
) => {
  let usersCollection = await users();

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    city: city,
    state: state,
    phoneNumber: phoneNumber,
    password: password,
    admin: false,
  };
  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not register user";
};

// function to remove user validation left
const removeUser = async (userId) => {
  const db = await dbConnection();
  try {
    userId = helper.checkId(userId);
  } catch (e) {
    throw e;
  }

  const userCollection = await users();

  const user = await getUserById(userId);

  const deletionInfo = await userCollection.deleteOne({
    _id: ObjectId(userId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete  with id of ${userId}`;
  }
  return `${user.firstName} ${user.lastName} has been sucessfully deleted!`;
};

const updateUser = async (
  firstName,
  lastName,
  gender,
  email,
  city,
  state,
  phoneNumber,
  password
) => {
  const db = await dbConnection();
  const userCollection = await users();

  const updateduser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    city: city,
    state: state,
    phoneNumber: phoneNumber,
    password: password,
  };

  let tmpUser = await getUserById(userId);

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $set: updatedUser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update user successfully";
  }
  // await closeConnection();
  // return await getMovieById(movieId);
};

// get user by id validations are left
const getUserById = async (userId) => {
  const db = await dbConnection();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });

  if (user == null) throw "No user with that id";
  user._id = ObjectId(user._id).toString();
  // await closeConnection();
  return user;
};

module.exports = {
  getUserById,
  createUser,
  updateUser,
  removeUser,
};
