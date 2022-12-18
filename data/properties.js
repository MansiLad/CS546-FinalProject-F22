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
//console.log('error')
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
    reviews: [],
    date: date,
    approved: true,
    //available: true,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
  console.log(insertInfo);
  return insertInfo.insertedId;

};

const getownerbypropId = async(propId) =>{
  if(!propId) throw 'Id must be provided'
  const propertyCollection = await properties();
  const prop_each = await propertyCollection.findOne({_id:ObjectId(propId)})
  let email_id = prop_each.UserId
  return email_id;
}

const getAllListings = async () => {
  // todo validations
  const properties_Collection = await properties();
  const properties_value = await properties_Collection
    .find({ approved: true })
    .toArray();
  arr = [];
  if (!properties_value) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties_value));
};

const getPropertyById = async (id) => {
  // todo validations
  if(!id){
    throw 'Error:Id not defined'
}
// id = parseInt(id);


if(typeof id !== 'number'){
    throw "Id should be number"
}
if(id < 1){
    throw 'ID not proper';
}
// if(!containsOnlyNumbers(id)){
//     throw "ID should not contain alphabets"
// }
if((id)%1 !==0) {
    throw "Decimals are not allowed"
}
// id = id.trim();
const data_id = await getAllListings();
if(id > data_id.length){
    throw [404,'No data id present']
}
let property = data_id.find(prop => prop.id == id);
return property;
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

const getByState = async (state) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "state": state})
    .toArray();
  return props;
};

const getByCity = async (city,state,zip) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ city: city,state:state,zipCode:zip})
    .toArray();
    return JSON.parse(JSON.stringify(props));
};


const getCity = async(city) =>{
  const properties_Collection = await properties();
  console.log('e')
  const properties = await properties_Collection.find({}).toArray();
  console.log('er')
  const prop_City = []
  properties.forEach(prop => {
        if(prop.city.toLowerCase().includes(city.toLowerCase())){
          prop_City.push(prop)
        }
  });
return prop_City;
}


const getByZipcode = async (zipCode) => {
  // todo validations
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "zipCode": zipCode })
    .toArray();
  return props;
};

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

// const getPropOwnerbyId = async (ownerId) => {
//   const propertyCollection = await properties();
//   let props = await propertyCollection
//     .find({ UserId: ownerId, approved: true})
//     .toArray();
//   return props;
// }
const getPropertybyOwner = async (ownerId) => {
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "UserId": ownerId /* , approved: true, available: true, */})
    .toArray();
  return props;
};

const addToFavourite = async function (userId, propertyId) {
  if (!userId) throw "You must provide an id to search for";
  if (!propertyId) throw "You must provide an id to search for";
  if(typeof userId !== "string" || typeof propertyId !== "string") throw "Ids should be string." 
  const usersCollection = await users();
  userId = ObjectId(userId.trim());
  recipeId = ObjectId(propertyId.trim());

  const updatedUserInfo = await usersCollection.updateOne(
    { _id: userId },
    { $addToSet: { favourites: propertyId } }
  );
  if (updatedUserInfo.modifiedCount === 0) throw "Can not add to the user";

  const user = await users_data.getUserById(userId.toString());

  return user.favourites;
};

module.exports = {
  addToFavourite,
  getPropertyById,
  createListing,
  updateListing,
  removeListing,
  getAllListings,
  getByCity,
  getByZipcode,
  getCity,
  getByState,
  approveAuth,
  getAllListings,
  getPropertybyOwner,
  getAllAuthListings,
  getownerbypropId
};
