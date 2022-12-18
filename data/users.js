const helper = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { dbConnection, closeConnection } = require("../config/mongoConnections");
const bcrypt = require("bcryptjs");
const validation = require('../helpers')

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

  if(!firstName)  throw 'You must provide a firstName'
  if (typeof firstName !== 'string')    throw 'Firstname must be a string';
  if (firstName.trim().length === 0)    throw 'Firstname cannot be an empty string or just spaces';
  firstName = firstName.trim()
  if(firstName.length < 4)               throw 'Firstname must of atleast 4 characters'

  if(!lastName)  throw 'You must provide a lastName'
  if (typeof lastName !== 'string')    throw 'Lastname must be a string';
  if (lastName.trim().length === 0)    throw 'Lastname cannot be an empty string or just spaces';
  lastName = lastName.trim()
  if(lastName.length < 4)               throw 'Lastname must of atleast 4 characters'

  if(!phonenumber){ throw "Phone Number not provided"  }
  if(phonenumber.trim().length === 0){throw "Phone number can not be empty or just spaces" }
  phonenumber = phonenumber.trim()
  if(phonenumber.length < 10){throw 'Phone number should be of 10 digits'}
  if(!/^[0-9]+$/.test(phonenumber)) {throw 'Phone number should only contain numbers'}

  if(!email) throw 'Enter email'
  if (email.trim().length === 0) throw "enter email id";
  email = email.trim()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) throw 'Enter valid email id'
  
  if(!password) throw ' enter password'
  if (password.trim().length === 0) throw "enter password";
  password = password.trim()
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

  if(!firstName)  throw 'You must provide a firstName'
  if (typeof firstName !== 'string')    throw 'Firstname must be a string';
  if (firstName.trim().length === 0)    throw 'Firstname cannot be an empty string or just spaces';
  firstName = firstName.trim()
  if(firstName.length < 4)               throw 'Firstname must of atleast 4 characters'

  if(!lastName)  throw 'You must provide a lastName'
  if (typeof lastName !== 'string')    throw 'Lastname must be a string';
  if (lastName.trim().length === 0)    throw 'Lastname cannot be an empty string or just spaces';
  lastName = lastName.trim()
  if(lastName.length < 4)               throw 'Lastname must of atleast 4 characters'

  if(!gender) throw 'Select gender'

  if(!phonenumber){ throw "Phone Number not provided"  }
  if(phonenumber.trim().length === 0){throw "Phone number can not be empty or just spaces" }
  phonenumber = phonenumber.trim()
  if(phonenumber.length < 10){throw 'Phone number should be of 10 digits'}
  if(!/^[0-9]+$/.test(phonenumber)) {throw 'Phone number should only contain numbers'}

  if(!email) throw 'Enter email'
  if (email.trim().length === 0) throw "enter email id";
  email = email.trim()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))'Enter valid email id'
  
  if(!password) throw ' enter password'
  if (password.trim().length === 0) throw "enter password";
  password = password.trim()
  if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password))) throw "Error: Password should contain atleast one Uppercase, one Number and one Special Character. "
  

  let newUser = {
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    email: email,
    // city: city,
    // state: state,
    phoneNumber: phoneNumber,
    password: password,
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
  if(!firstName)  throw 'You must provide a firstName'
  if (typeof firstName !== 'string')    throw 'Firstname must be a string';
  if (firstName.trim().length === 0)    throw 'Firstname cannot be an empty string or just spaces';
  firstName = firstName.trim()
  if(firstName.length < 4)               throw 'Firstname must of atleast 4 characters'

  if(!lastName)  throw 'You must provide a lastName'
  if (typeof lastName !== 'string')    throw 'Lastname must be a string';
  if (lastName.trim().length === 0)    throw 'Lastname cannot be an empty string or just spaces';
  lastName = lastName.trim()
  if(lastName.length < 4)               throw 'Lastname must of atleast 4 characters'

  if(!gender) throw 'Select gender'

  if(!phonenumber){ throw "Phone Number not provided"  }
  if(phonenumber.trim().length === 0){throw "Phone number can not be empty or just spaces" }
  phonenumber = phonenumber.trim()
  if(phonenumber.length < 10){throw 'Phone number should be of 10 digits'}
  if(!/^[0-9]+$/.test(phonenumber)) {throw 'Phone number should only contain numbers'}

  if(!email) throw 'Enter email'
  if (email.trim().length === 0) throw "enter email id";
  email = email.trim()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))'Enter valid email id'

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
  userId = validation.checkId(userId)
  const db = await dbConnection();
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(userId) });

  if (user == null) throw "No user with that id";
  user._id = ObjectId(user._id).toString();
  // await closeConnection();
  return user;
};

const checkUser = async (email, password) => {
  if(!email) throw 'Enter email'
  if (email.trim().length === 0) throw "enter email id";
  email = email.trim()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) throw 'Enter valid email id'
  
  if(!password) throw ' enter password'
  if (password.trim().length === 0) throw "enter password";
  password = password.trim()
  if(!(/^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{6,}$/.test(password))) throw "Error: Password should contain atleast one Uppercase, one Number and one Special Character. "
  
  const usersindb = await users();

  const checkusername = await usersindb.findOne({ email: email });
  // console.log(checkusername)

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

const userExist = async(email) =>{
  if(!email) throw "You must provide email id"
  const usersCollection = await users();
  const checkUser = await usersCollection.findOne({ email: email });
  if (checkUser) return true;
  return false;
};

const getUserByEmail = async(email) =>{
  if(!email) throw "You must provide email id."
  if (email.trim().length === 0) throw "enter email id";
  email = email.trim()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))'Enter valid email id'

  const usersCollection = await users();
  const checkUser = await usersCollection.findOne({ email: email });
  console.log(checkUser)
  if (checkUser === null) throw "User doesnot exist";
  return checkUser._id;
};

module.exports = {
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  removeUser,
  createAdmin,
  checkUser,
  userExist
};
