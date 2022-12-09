const { ObjectId } = require("mongodb");
//const { users } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const users = mongoCollections.users;
const users_data = require("./users");

// function to add listing validations left
const createListing = async (
  UserId,
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
  ammenities
) => {
  let propertiesCollection = await properties();
  let userCollection = await users();
  let date = new Date().toLocaleDateString();
  let newListing = {
    UserId: UserId,
    // apartmentNumber: apartmentNumber,
    // street: street,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    beds: beds,
    baths: baths,
    deposit: deposit,
    rent: rent,
    description: description,
    ammenities: ammenities,
    reviews: [],
    datePosted: date,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
};

const getAllListings = async () => {
  const property_Collection = await properties();
  const properties = await property_Collection.find({}).toArray();
  arr = [];
  if (!properties) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties));
};

const getPropertyById = async (propertyID) => {
  let id = propertyID;
  if (!id || id.length == 0) {
    throw "Not valid id";
  }
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "Id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  const property_Collection = await properties();
  const prop = await property_Collection.findOne({ _id: ObjectId(id) });
  if (prop === null) throw "no movies with that id";
  return JSON.parse(JSON.stringify(prop));
  //return moviesF;
};

const removeListing = async (propertyID) => {
  let id = propertyID;
  if (!id || id.length === 0) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";
  const property_Collection = await properties();
  let get_property = await getPropertyById(id);
  const deletionInfo = await property_Collection.deleteOne({
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
  ammenities
) => {
  // validations are left

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
  };

  let tmpListing = await getPropertyById(propertyId);

  const updatedInfo = await movieCollection.updateOne(
    { _id: ObjectId(propertyId) },
    { $set: updatedListing }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update movie successfully";
  }
  // await closeConnection();
  // return await getPropertyById(propertyId);
};

const getByState = async (state) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection.find({ state: state }).toArray();
  return props;
};

const getByCity = async (city) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection.find({ city: city }).toArray();
  return props;
};

const getByZipcode = async (zipCode) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection.find({ zipCode: zipCode }).toArray();
  return props;
};

module.exports = {
  getPropertyById,
  createListing,
  updateListing,
  removeListing,
  getAllListings,
  getByCity,
  getByState,
  getByZipcode,
};
