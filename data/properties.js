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

const getpropertybtID = async (propertyID) => {
    let id = propertyID;
    if(!id || id.length == 0){
      throw "Not valid id"
    }
    if (typeof id !== 'string') throw 'Id must be a string';
    if (id.trim().length === 0) throw 'Id cannot be an empty string or just spaces';
    id = id.trim();
    if (!ObjectId.isValid(id)) throw 'invalid object ID';
    const property_Collection = await properties();
    const prop = await property_Collection.findOne({_id:ObjectId(id)})
    if(prop === null) throw "no movies with that id"
    return JSON.parse(JSON.stringify(prop));
    //return moviesF;
  };

  const removeListing = async (propertyID) => {
    let id = propertyID;
      if (!id || id.length === 0) throw 'You must provide an id to search for';
      if (typeof id !== 'string') throw 'Id must be a string';
      if (id.trim().length === 0)
        throw 'id cannot be an empty string or just spaces';
      id = id.trim();
      if (!ObjectId.isValid(id)) throw 'invalid object ID';
      const property_Collection = await properties();
      let get_property = await getPropertyById(id);
      const deletionInfo = await property_Collection.deleteOne({_id: ObjectId(id)});
      //let movie_name = get_movie.title;
  
      if (deletionInfo.deletedCount === 0) {
        throw `Could not delete dog with id of ${id}`;
      }
      return 'Property is succesfully deleted!' ;
  
  };

