const helper = require("../helpers");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const { dbConnection, closeConnection } = require("../config/mongoConnection");


const createUser = async (
    firstName,
    lastName,
    gender,
    email,
    city,
    state,
    phoneNumber,
    password
) =>{
    let usersCollection = await users();
    
    let newUser = {
        firstName:firstName,
        lastName:lastName,
        gender: gender,
        email: email,
        city: city,
        state:state,
        phoneNumber:phoneNumber,
        password:password,
        feedback : [],
        admin: false,
    };
    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not register user";

}

const removeUser = async (userId) => {
    const db = await dbConnection();
    try {
      userId = helper.checkId(userId);
    } catch (e) {
      throw e;
    }
  
    const movieCollection = await movies();
  
    const user= await getMovieById(userId);
  
    const deletionInfo = await movieCollection.deleteOne({
      _id: ObjectId(userId),
    });
  
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete  with id of ${userId}`;
    }
    return `${user.firstName} ${user.lastName} has been sucessfully deleted!`;
  };

