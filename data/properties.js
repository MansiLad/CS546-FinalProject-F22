const { ObjectId } = require("mongodb");
//const { users } = require("../config/mongoCollections");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const users = mongoCollections.users;
const auth = mongoCollections.unauthprop;
const reviews = require("./reviews");
const users_data = require("./users");
const fs = require("fs");
const multer = require('multer');
const { validateHeaderName } = require("http");
const validation = require('../helpers')

// function to add listing validations left

const createListing = async (
  UserId,
  address,
  city,
  state,
  zipcode,
  beds,
  baths,
  deposit,
  rent,
  description,
  ammenities
  //images,
) => {

  //id = validation.checkId(UserId)

  if(!address)  throw 'You must provide a address'
  if (typeof address !== 'string')    throw 'City must be a string';
  if (address.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  address = address.trim()
  if(address.length < 4)               throw 'City must of atleast 4 characters'

  if(!city)  throw 'You must provide a city'
  if (typeof city !== 'string')    throw 'City must be a string';
  if (city.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  city = city.trim()
  if(city.length < 2)               throw 'City must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(city))  throw 'City should only contain letters'

  if(!state)  throw 'You must provide a state'
  if (typeof state !== 'string')    throw 'State must be a string';
  if (state.trim().length === 0)    throw 'State cannot be an empty string or just spaces';
  state = state.trim()
  if(state.length < 2)               throw 'State must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(state))  throw 'State should only contain letters'

  if(!zipcode)  throw 'You must provide a zipcode'
  if (typeof zipcode !== 'string')    throw 'Zip must be a string';
  if (zipcode.trim().length === 0)    throw 'Zip cannot be an empty string or just spaces';
  zipcode = zipcode.trim()
  if(zipcode.length < 3)               throw 'Zip must of atleast 2 characters'
  if(!/^\d{5}(-\d{4})?$/.test(zipcode))  throw 'Zip should only contain letters'

  if(!beds) throw 'You must provide number of beds'
  if(beds.trim().length === 0)  throw 'Number of beds cannot be empty'
  beds = beds.trim()
  if(!/^[0-9]+$/.test(beds))   throw 'Number of beds should be a number'

  if(!baths) throw 'You must provide number of baths'
  if(baths.trim().length === 0)  throw 'Number of baths cannot be empty'
  baths = baths.trim()
  if(!/^[0-9]+$/.test(baths))   throw 'Number of baths should be a number'

  if(!deposit)  throw 'You must provide a deposit amount'
  if (!/^[0-9]+$/.test(deposit))    throw 'Deposit must be a number';
  if (deposit.trim().length === 0)    throw 'Deposit cannot be an empty string or just spaces';
  deposit = deposit.trim()

  if(!rent)  throw 'You must provide a rent amount'
  if (!/^[0-9]+$/.test(rent))    throw 'Rent must be a number';
  if (rent.trim().length === 0)    throw 'Rent cannot be an empty string or just spaces';
  rent = rent.trim()

  if(!description)  throw 'You must provide a description'
  if (typeof description !== 'string')    throw 'Description must be a string';
  if (description.trim().length === 0)    throw 'Description cannot be an empty string or just spaces';
  description = description.trim()
  if(description.length < 4)               throw 'Description must of atleast 4 characters'

  if(!ammenities)  throw 'You must provide a ammenities'
  if (typeof ammenities !== 'string')    throw 'Ammenities must be a string';
  if (ammenities.trim().length === 0)    throw 'Ammenities cannot be an empty string or just spaces';
  ammenities = ammenities.trim()
  if(ammenities.length < 4)               throw 'Ammenities must of atleast 4 characters'

  let propertiesCollection = await properties();
  let userCollection = await users();
  let date = new Date().toLocaleDateString();
  // let image_buffer = new Buffer ()
  let flag = { insertedProp: true };
//console.log('error')
  let newListing = {
    UserId: UserId,
    // propertyId: ObjectId(),
    address: address,
    city: city,
    state: state,
    zipcode: zipcode,
    beds: beds,
    baths: baths,
    deposit: deposit,
    rent: rent,
    description: description,
    ammenities: ammenities,
    images: [],
    reviews: [],
    date: date,
    approved: false,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
  return flag;
};

const getownerbypropId = async(propId) =>{
  if(!propId) throw 'Id must be provided'
  propId = validation.checkId(propId)
  const propertyCollection = await properties();
  const prop_each = await propertyCollection.findOne({_id:ObjectId(propId)})
  if(!prop_each)  throw 'No property with this id'
  let email_id = prop_each.UserId
  return email_id;
}

const getAllListings = async () => {
  const properties_Collection = await properties();
  const properties_value = await properties_Collection
    .find({})
    .toArray();
  arr = [];
  if (!properties_value) {
    return arr;
  }
  return JSON.parse(JSON.stringify(properties_value));
};

const getPropertyById = async (id) => {
  id = validation.checkId(id)

  const propertyCollection = await properties();
  const prop_each = await propertyCollection.findOne({_id:ObjectId(id)})

  if(!prop_each) throw "no property with that id"
  return JSON.parse(JSON.stringify(prop_each));
  };


const removeListing = async (propertyID) => {
  let id = propertyID;
  if (!id || id.length === 0) throw "You must provide an id to search for";
  if (typeof id !== "string") throw "Id must be a string";
  if (id.trim().length === 0)
    throw "id cannot be an empty string or just spaces";
  id = id.trim();
  if (!ObjectId.isValid(id)) throw "invalid object ID";

  const properties_Collection = await properties();
  let get_property = await getPropertyById(id);
  if(!get_property) throw 'No property with this ID'
  const deletionInfo = await properties_Collection.deleteOne({
    _id: ObjectId(id),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete property with id of ${id}`;
  }
  return "Property is succesfully deleted!";
};

const updateListing = async (
  propertyId,
  address,
  city,
  state,
  zipcode,
  beds,
  baths,
  deposit,
  rent,
  description,
  ammenities,
  available,
) => {
    
  //propertyId = validation.checkId(propertyId)

  if(!address)  throw 'You must provide a address'
  if (typeof address !== 'string')    throw 'City must be a string';
  if (address.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  address = address.trim()
  if(address.length < 4)               throw 'City must of atleast 4 characters'

  if(!city)  throw 'You must provide a city'
  if (typeof city !== 'string')    throw 'City must be a string';
  if (city.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  city = city.trim()
  if(city.length < 2)               throw 'City must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(city))  throw 'City should only contain letters'

  if(!state)  throw 'You must provide a state'
  if (typeof state !== 'string')    throw 'State must be a string';
  if (state.trim().length === 0)    throw 'State cannot be an empty string or just spaces';
  state = state.trim()
  if(state.length < 2)               throw 'State must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(state))  throw 'State should only contain letters'

  if(!zipcode)  throw 'You must provide a zipcode'
  if (typeof zipcode !== 'string')    throw 'Zip must be a string';
  if (zipcode.trim().length === 0)    throw 'Zip cannot be an empty string or just spaces';
  zipcode = zipcode.trim()
  if(zipcode.length < 3)               throw 'Zip must of atleast 2 characters'
  if(!/^\d{5}(-\d{4})?$/.test(zipcode))  throw 'Zip should only contain letters'

  if(!beds) throw 'You must provide number of beds'
  if(beds.trim().length === 0)  throw 'Number of beds cannot be empty'
  beds = beds.trim()
  if(!/^[0-9]+$/.test(bed))   throw 'Number of beds should be a number'

  if(!baths) throw 'You must provide number of baths'
  if(baths.trim().length === 0)  throw 'Number of baths cannot be empty'
  baths = baths.trim()
  if(!/^[0-9]+$/.test(bed))   throw 'Number of baths should be a number'

  if(!deposit)  throw 'You must provide a deposit amount'
  if (!/^[0-9]+$/.test(deposit))    throw 'Deposit must be a number';
  if (deposit.trim().length === 0)    throw 'Deposit cannot be an empty string or just spaces';
  deposit = deposit.trim()

  if(!rent)  throw 'You must provide a rent amount'
  if (!/^[0-9]+$/.test(rent))    throw 'Rent must be a number';
  if (rent.trim().length === 0)    throw 'Rent cannot be an empty string or just spaces';
  rent = rent.trim()

  if(!description)  throw 'You must provide a description'
  if (typeof description !== 'string')    throw 'Description must be a string';
  if (description.trim().length === 0)    throw 'Description cannot be an empty string or just spaces';
  description = description.trim()
  if(description.length < 4)               throw 'Description must of atleast 4 characters'

  if(!ammenities)  throw 'You must provide a ammenities'
  if (typeof ammenities !== 'string')    throw 'Ammenities must be a string';
  if (ammenities.trim().length === 0)    throw 'Ammenities cannot be an empty string or just spaces';
  ammenities = ammenities.trim()
  if(ammenities.length < 4)               throw 'Ammenities must of atleast 4 characters'


  const propertyCollection = await properties();
  let date = new Date().toLocaleDateString();
  const updatedListing = {
    address: address,
    city: city,
    state: state,
    zipcode: zipcode,
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
    throw "could not update property successfully";
  }
  // await closeConnection();
  // return await getPropertyById(propertyId);
};

const updateproperty = async (
  propertyId,
  deposit,
  rent,
  ammenities,
  description,
  available,
) => {
  propertyId = validation.checkId(propertyId)
  
  if(!deposit)  throw 'You must provide a deposit amount'
  if (!/^[0-9]+$/.test(deposit))    throw 'Deposit must be a number';
  if (deposit.trim().length === 0)    throw 'Deposit cannot be an empty string or just spaces';
  deposit = deposit.trim()

  if(!rent)  throw 'You must provide a rent amount'
  if (!/^[0-9]+$/.test(rent))    throw 'Rent must be a number';
  if (rent.trim().length === 0)    throw 'Rent cannot be an empty string or just spaces';
  rent = rent.trim()

  if(!description)  throw 'You must provide a description'
  if (typeof description !== 'string')    throw 'Description must be a string';
  if (description.trim().length === 0)    throw 'Description cannot be an empty string or just spaces';
  description = description.trim()
  if(description.length < 4)               throw 'Description must of atleast 4 characters'

  if(!ammenities)  throw 'You must provide a ammenities'
  if (typeof ammenities !== 'string')    throw 'Ammenities must be a string';
  if (ammenities.trim().length === 0)    throw 'Ammenities cannot be an empty string or just spaces';
  ammenities = ammenities.trim()
  if(ammenities.length < 4)               throw 'Ammenities must of atleast 4 characters'


  const propertyCollection = await properties();
  let tempprop = await getPropertyById(propertyId)
  console.log(tempprop)

  let date = new Date().toLocaleDateString();
  const updatedListing = {
    address: tempprop.address,
    city:  tempprop.city,
    state:  tempprop.state,
    zipcode:  tempprop.zipcode,
    beds:  tempprop.beds,
    baths:  tempprop.baths,
    deposit: deposit,
    rent: rent,
    ammenities: ammenities,
    description: description,
    datePosted: date,
    available: available,
  };

  const updatedInfo = await propertyCollection.updateOne(
    { _id: ObjectId(propertyId) },
    { $set: updatedListing }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update property";
  }
  // await closeConnection();
  // return await getPropertyById(propertyId);
};


const getByState = async (state) => {
  // todo validations
  if(!state)  throw 'You must provide a state'
  if (typeof state !== 'string')    throw 'State must be a string';
  if (state.trim().length === 0)    throw 'State cannot be an empty string or just spaces';
  state = state.trim()
  if(state.length < 2)               throw 'State must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(state))  throw 'State should only contain letters'
  

  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "state": state})
    .toArray();
  if(!props)  throw 'No properties in this state'
  return props;
};

const getByCity = async (city,state,zip) => {
  // todo validations
  if(!city)  throw 'You must provide a city'
  if (typeof city !== 'string')    throw 'City must be a string';
  if (city.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  city = city.trim()
  if(city.length < 2)               throw 'City must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(city))  throw 'City should only contain letters'

  if(!state)  throw 'You must provide a state'
  if (typeof state !== 'string')    throw 'State must be a string';
  if (state.trim().length === 0)    throw 'State cannot be an empty string or just spaces';
  state = state.trim()
  if(state.length < 2)               throw 'State must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(state))  throw 'State should only contain letters'

  if(!zip)  throw 'You must provide a zip'
  if (typeof zip !== 'string')    throw 'Zip must be a string';
  if (zip.trim().length === 0)    throw 'Zip cannot be an empty string or just spaces';
  zip = zip.trim()
  if(zip.length < 3)               throw 'Zip must of atleast 2 characters'
  if(!/^\d{5}(-\d{4})?$/.test(zip))  throw 'Zip should only contain letters'

  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ city: city,state:state,zipcode:zip})
    .toArray();
  if(!props) throw 'there are no properties in this region'
    return JSON.parse(JSON.stringify(props));
};


const getCity = async(city) =>{

  if(!city)  throw 'You must provide a city'
  if (typeof city !== 'string')    throw 'City must be a string';
  if (city.trim().length === 0)    throw 'City cannot be an empty string or just spaces';
  city = city.trim()
  if(city.length < 2)               throw 'City must of atleast 2 characters'
  if(!/^[A-Za-z\s]+$/.test(city))  throw 'City should only contain letters'


  const properties_Collection = await properties();
  console.log('e')
  const properties = await properties_Collection.find({}).toArray();
  if(!properties) throw 'No properties in this city'
  console.log('er')
  const prop_City = []
  properties.forEach(prop => {
        if(prop.city.toLowerCase().includes(city.toLowerCase())){
          prop_City.push(prop)
        }
  });
return prop_City;
}


const getByZipcode = async (zipcode) => {
  // todo validations
  if(!zip)  throw 'You must provide a zip'
  if (typeof zip !== 'string')    throw 'Zip must be a string';
  if (zip.trim().length === 0)    throw 'Zip cannot be an empty string or just spaces';
  zip = zip.trim()
  if(zip.length < 3)               throw 'Zip must of atleast 2 characters'
  if(!/^\d{5}(-\d{4})?$/.test(zip))  throw 'Zip should only contain letters'

  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "zipcode": zipcode })
    .toArray();
  if(!props) throw 'there are no properties in this region'

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
    { _id: ObjectId(id) },
    { $set: { approved: true } }
  );
  return updatedInfo
};

const getPropertybyOwner = async (ownerId) => {
  //ownerId = validation.checkId(ownerId)
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(ownerId)){
    throw 'Enter valid ownerId'
  }
  const propertyCollection = await properties();
  let props = await propertyCollection
    .find({ "UserId": ownerId /* , approved: true, available: true, */})
    .toArray();
  if(!props) throw 'there are no properties by this owner'
  return props;
};

const addToFavourite = async function (userId, propertyId) {
  console.log("Fav")
  
  userId = userId.toString();

  if (!userId) throw "You must provide an id to search for";
  if (!propertyId) throw "You must provide an id to search for";
  if(typeof userId !== "string" || typeof propertyId !== "string") throw "Ids should be string." 
  const usersCollection = await users();


  const updatedUserInfo = await usersCollection.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { favourites: propertyId } }
  );

  if (updatedUserInfo.modifiedCount === 0) throw "Can not add to the user";

  const user = await users_data.getUserById(userId);

  return user.favourites;
};


const createListingSeed = async (
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
  images,
  description,
  ammenities
) => {
  // todo validations
  let propertiesCollection = await properties();
  let userCollection = await users();
  let date = new Date().toLocaleDateString();
  // let image_buffer = new Buffer ()
  let flag = { insertedProp: true };
//console.log('error')
  let newListing = {
    UserId: UserId,
   // propertyId: ObjectId(),
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
    images: images,
    reviews: [],
    date: date,
    approved: false,
  };
  const insertInfo = await propertiesCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
  console.log(insertInfo);
  return insertInfo.insertedId;

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
  getownerbypropId,
  createListingSeed,
  updateproperty
};
