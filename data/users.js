const helper = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { dbConnection, closeConnection } = require("../config/mongoConnections");
const bcrypt = require("bcryptjs");

// function for creating a user validations are left
const createUser = async (
  firstName,
  lastName,
  gender,
  email,
  // city,
  // state,
  phoneNumber,
  password,
  type
) => {

  if(!firstName || !lastName || !gender || !email || !phoneNumber || !password || !type) throw "Enter all the fields correctly."

  if(typeof(firstName) !== 'string' || typeof(lastName) !== 'string' ) throw "Enter valid name"

  if(phoneNumber.length !== 10) throw "Enter valid phone number"

  

  if(typeof(email) !== 'string' ) throw "Enter valid email"
  
  if(typeof(password) !== 'string') throw "Enter valid password"

  if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password))) throw "Error: Password should contain atleast one Uppercase, one Number and one Special Character. "


  
  let usersCollection = await users();

  const saltRounds = 10;
  const encryptpassword = await bcrypt.hash(password, saltRounds);

  let flag = { insertedUser: true };

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    // city: city,
    // state: state,
    phoneNumber: phoneNumber,
    password: encryptpassword,
    type: type,
    favourites: [], //added favourites
    propertyIDs: [], //for display of all properties
  };

  const checkusername = await usersCollection.findOne({ email: email });

  if (checkusername !== null) throw "Username Exist! Enter a new one";

  const insertInfo = await usersCollection.insertOne(newUser);

  if (insertInfo.insertedCount === 0) {
    throw "Could not register user!";
  } else {
    return flag;
  }
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

const createAdmin = async (
  firstName,
  lastName,
  gender,
  email,
  // city,
  // state,
  phoneNumber,
  password
) => {
  let usersCollection = await users();
  const saltRounds = 10;
  const encryptpassword = await bcrypt.hash(password, saltRounds);
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    // city: city,
    // state: state,
    phoneNumber: phoneNumber,
    password: encryptpassword,
    type: "admin",
  };
  const insertInfo = await usersCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not register user";
};

const updateUser = async (
  firstName,
  lastName,
  gender,
  email,
  // city,
  // state,
  phoneNumber
) => {
  const db = await dbConnection();
  const userCollection = await users();

  const checkUser = await userCollection.findOne({ email: email });
  if (checkUser === null) throw "User doesnot exist";

  const updateduser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    // city: city,
    // state: state,
    phoneNumber: phoneNumber,
  };

  let tmpUser = await getUserById(checkUser._id);

  if (!tmpUser) {
    throw "User does not exist!";
  }

  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(tmpUser._id) },
    { $set: updateduser }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update user successfully";
  }
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

const checkUser = async (email, password) => {
  const usersindb = await users();

  const checkusername = await usersindb.findOne({ email: email });

  if (!checkusername) throw "Either the username or password is invalid";

  const password_check = await bcrypt.compare(password, checkusername.password);

  if (!password_check) throw "Either the username or password is invalid";
  let flag = null;
  if (checkusername.type === "admin") {
     flag = { authenticatedUser: true, type: "admin" };
  }

  if (checkusername.type === "seller") {
     flag = { authenticatedUser: true, type: "seller" };
  }

  if (checkusername.type === "buyer") {
     flag = { authenticatedUser: true, type: "buyer" };
  }

  return flag;
};



const getUserByEmail = async(email) =>{
  if(!email) throw "You must provide correct email id."
  const usersCollection = await users();
  const checkUser = await usersCollection.findOne({ email: email });
  if (checkUser === null) throw "User doesnot exist";
  return checkUser;
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  removeUser,
  createAdmin,
  checkUser,
};
