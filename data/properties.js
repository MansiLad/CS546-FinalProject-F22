const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const property_data = require("./properties");

// function to add listing validations left 
const createListing = async (
  apartmentNumber,
  street,
  city,
  state,
  zipCode,
  beds,
  baths,
  deposit,
  rent,
  description,
  ammenities,
) => {
  let propertiesCollection = await properties();

  let newListing = {
    apartmentNumber: apartmentNumber,
    street: street,
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
  };
  const insertInfo = await usersCollection.insertOne(newListing);
  if (insertInfo.insertedCount === 0) throw "Could not create Lisiting";
};

const getAllListings = async () => {

    const property_Collection = await properties();
    const properties = await property_Collection.find({}).toArray();
    arr = [];
    if(!properties){
      return arr;
    }
    return JSON.parse(JSON.stringify(properties));
  };

  

