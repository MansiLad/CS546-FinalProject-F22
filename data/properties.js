const { ObjectId } = require("mongodb");
//const { users } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const users = mongoCollections.users;
const auth = mongoCollections.unauthprop;
const reviews = require("./reviews");
const users_data = require("./users");
const fs = require("fs");
const multer = require('multer')
// function to add listing validations left
const createListing = async (
  User,
  // apartmentNumber,
  // street,
  address,
  city,
  state,
  zipCode,
  beds,
  baths,
  deposit,
  rent,
  description,
  amenities
  //images,
) => {
  // todo validations
  let propertiesCollection = await properties();
  let userCollection = await users();
  let date = new Date().toLocaleDateString();
  // let image_buffer = new Buffer ()
  let flag = { insertedProp: true };

  let newListing = {
    User: User,
    // apartmentNumber: apartmentNumber,
    // street: street,
    propertyId: ObjectId(),
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    beds: beds,
    baths: baths,
    deposit: deposit,
    rent: rent,
    description: description,
    amenities: amenities,
    images: [],
    reviews: {},
    date: date,
    approved: false,
    available: true,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
  console.log(insertInfo);
  return insertInfo.insertedId;

};

const getAllListings = async () => {
  // todo validations
  const properties_Collection = await properties();
  const properties = await properties_Collection
    .find({ approved: true, available: true })
    .toArray();
  arr = [];
  if (!properties) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties));
};


const getPropertyById = async (propertyID) => {
  // todo validations
  let id = propertyID;
  if (!id || id.length == 0) {
    throw "Not valid id";
  }
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  const properties_Collection = await properties();
  const prop = await properties_Collection.findOne({ _id: ObjectId(id) });
  if (prop === null) throw "no movies with that id";
  return JSON.parse(JSON.stringify(prop));
  //return moviesF;
};

const removeListing = async (propertyID) => {
  // todo validations
  let id = propertyID;
  if (!id || id.length === 0) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  const properties_Collection = await properties();
  let get_property = await getPropertyById(id);
  const deletionInfo = await properties_Collection.deleteOne({
    _id: ObjectId(id),
  });
  //let movie_name = get_movie.title;

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete dog with id of ${id}`;
  }
  return "Property is succesfully deleted!";
};

const updateListing = async (
  propertyId,
  address,
  city,
  state,
  zipCode,
  beds,
  baths,
  deposit,
  rent,
  description,
  ammenities,
  available,
) => {
  // todo validations

  const db = await dbConnection();
  const propertyCollection = await properties();
  let date = new Date().toLocaleDateString();
  const updatedListing = {
    address: address,
    // street: street,
    city: city,
    state: state,
    zipCode: zipCode,
    beds: beds,
    baths: baths,
    deposit: deposit,
    rent: rent,
    description: description,
    ammenities: ammenities,
    datePosted: date,
    available: available,
  };

  let tmpListing = await getPropertyById(propertyId);

  const updatedInfo = await propertyCollection.updateOne(
    { _id: ObjectId(propertyId) },
    { $set: updatedListing }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update movie successfully";
  }
  // await closeConnection();
  // return await getPropertyById(propertyId);
};

// const getByState = async (state, city, zipCode) => {
//   // todo validations
//   const propertyCollection = await properties();
//   let props = await propertyCollection
//     .find({ state: state, approved: true, available: true, })
//     .toArray();
//   return props;
// };

const getByCity = async (city,state,zipCode) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ city: city,zipCode: zipCode, state: state, approved: true, available: true })
    .toArray();
  return props;
};

// const getByZipcode = async (zipCode) => {
//   // todo validations
//   const propertyCollection = await properties();
//   let props = await propertyCollection
//     .find({ zipCode: zipCode, approved: true, available: true, })
//     .toArray();
//   return props;
// };

const getAllAuthListings = async () => {
  // todo validations
  const properties_Collection = await properties();
  const properties = await properties_Collection
    .find({ approved: false })
    .toArray();
  arr = [];
  if (!properties) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties));
};

// const removeAuthListings = async (propertyID) => {
//   // todo validations
//   let id = propertyID;
//   if (!id || id.length === 0) throw "You must provide an id to search for";
//   if (typeof id !== "string") throw "Id must be a string";
//   if (id.trim().length === 0)
//     throw "id cannot be an empty string or just spaces";
//   id = id.trim();
//   if (!ObjectId.isValid(id)) throw "invalid object ID";
//   const properties_Collection = await properties();
//   let get_property = await getAuthById(id);
//   const deletionInfo = await properties_Collection.deleteOne({
//     _id: ObjectId(id),
//   });
//   //let movie_name = get_movie.title;

//   if (deletionInfo.deletedCount === 0) {
//     throw `Could not delete property with id of ${id}`;
//   }
//   return "Property is succesfully deleted!";
// }

// const getAuthById = async (propertyID) => {
//   // todo validations
//   let id = propertyID;
//   if (!id || id.length == 0) {
//     throw "Not valid id";
//   }
//   if (typeof id !== "string") throw "Id must be a string";
//   if (id.trim().length === 0)
//     throw "Id cannot be an empty string or just spaces";
//   id = id.trim();
//   if (!ObjectId.isValid(id)) throw "invalid object ID";
//   const auth_Collection = await auth();
//   const prop = await auth_Collection.findOne({ _id: ObjectId(id) });
//   if (prop === null) throw "no movies with that id";
//   return JSON.parse(JSON.stringify(prop));
//   //return moviesF;
// };

const approveAuth = async (propertyID) => {
  // todo validations
  let id = propertyID;
  if (!id || id.length == 0) {
    throw "Not valid id";
  }
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  // const auth_Collection = await auth();
  const properties_Collection = await properties();
  const updatedInfo = await properties_Collection.updateOne(
    { _id: ObjectId(propertyId) },
    { $set: { aprroved: true } }
  );
};

const getPropOwnerbyId = async (ownerId) => {
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ User: ownerId, approved: true, available: true,})
    .toArray();
  return props;
}

module.exports = {
  getPropertyById,
  createListing,
  updateListing,
  removeListing,
  getAllListings,
  getByCity,
  // getByState,
  // getByZipcode,
  approveAuth,
  getAllListings,
  getPropOwnerbyId,
  getAllAuthListings
};
