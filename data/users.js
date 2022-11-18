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
        type: type, //   we will figure it out after raw front end
        phoneNumber:phoneNumber,
        password:password,
        feedback : [],
        admin: false,
    };
    const insertInfo = await usersCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not register user";

}

