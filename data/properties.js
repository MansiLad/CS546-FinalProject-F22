const { ObjectId } = require("mongodb");
//const { users } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const users = mongoCollections.users;
const auth = mongoCollections.unauthprop;
const reviews = require("./reviews");
const users_data = require("./users");
const fs = require("fs");
const console = require("console");

// function to add listing validations left
const createListing = async (
  // UserId,
  address,
  city,
  state,
  zipCode,
  beds,
  baths,
  deposit,
  rent,
  //description,
  ammenities
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
    // UserId: UserId,
    // apartmentNumber: apartmentNumber,
    // street: street,
    // propertyId: _id,
    address: address,
    city: city,
    state: state,
    zipCode: zipCode,
    beds: beds,
    baths: baths,
    deposit: deposit,
    rent: rent,
    //description: description,
    ammenities: ammenities,
    images: [],
    reviews: [],
    date: date,
    approved: true,
    //available: true,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
  return flag;

};

const getAllListings = async () => {
  // todo validations
  const properties_Collection = await properties();
  const properties = await properties_Collection
    .find({ approved: true })
    .toArray();
  arr = [];
  if (!properties) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties));
};


const getPropertyById = async (id) => {
  // todo validations
  if(!id){
    throw 'Error:Id not defined'
}
// id = parseInt(id);


// if(typeof id !== 'number'){
//     throw "Id should be number"
// }
// if(id < 1){
//     throw 'ID not proper';
// }
// // if(!containsOnlyNumbers(id)){
// //     throw "ID should not contain alphabets"
// // }
// if((id)%1 !==0) {
//     throw "Decimals are not allowed"
// }
// id = id.trim();

const propertyCollection = await properties();
  const prop_each = await propertyCollection.findOne({_id:ObjectId(id)})

if(prop_each === null) throw "no movies with that id"
return JSON.parse(JSON.stringify(prop_each));

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
// const getByCity = async (value) => {
//   // todo validations
//   const propertyCollection = await properties();
//   let props = await propertyCollection
//     .find({$text:{$search:value}})
//     .toArray();
//   return props;
// };

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
  const auth_Collection = await auth();
  const properties_Collection = await properties();
  const updatedInfo = await properties_Collection.updateOne(
    { _id: ObjectId(propertyId) },
    { $set: { aprroved: true } }
  );
};

const getPropOwnerbyId = async (ownerId) => {
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ UserId: ownerId, approved: true, available: true,})
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
 getByZipcode,
 getCity,
  getByState,
  approveAuth,
  getAllListings,
  getPropOwnerbyId,
  getAllAuthListings
};
