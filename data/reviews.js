const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const property_data = require("./properties");

const createReview = async (
  propertyId,
  review
) => {
  // if (!propertyId || !review) {
  //   throw "No Input";
  // }
  // if (
  //   typeof propertyId != "string" ||
  //   typeof review != "string"
  // ) {
  //   throw "Parameters are not string";
  // }

  // if (
  //   propertyId.trim().length == 0 ||
  //   review.trim().length == 0
  // ) {
  //   throw "Length should not be zero";
  // }

  // if (!ObjectId.isValid(propertyId)) {
  //   throw "Not a valid object id";
  // }

  // let data = await property_data.getPropertyById(propertyId);
  // if (!data) {
  //   throw "No movie woth this id";
  // }
  const property_collection = await properties();
  const property = await property_collection.findOne({
    _id: ObjectId(propertyId)
  });
  if (!property) throw "Could not find movie";

  const new_Review = {
    _id: ObjectId(),
    propertyId: propertyId,
    review: review,
  };
  property.reviews.push(new_Review);
  let new_prop = property
  const updatedInfo = await property_collection.updateOne(
    { _id: ObjectId(propertyId) },
    {
        $push: { reviews: new_Review },
       // $set: { overallRating: newOverallRating },
    }
  );
  //console.log(property)
  if(updatedInfo.modifiedCount=== 0) throw "Could not add review"
  //console.log(property.reviews)
  return JSON.parse(JSON.stringify(new_Review));
};


const getAllReviews = async (propertyId) => {
  //const movie = await get_movie(userId);
  if(!propertyId){
    throw 'No id';
  }
  if(typeof propertyId !== 'string') throw 'Not string datatype';
  if(propertyId.trim().length==0) throw 'lenght should not be zero'
  if (!ObjectId.isValid(propertyId)){
    throw 'Not a valid object id'
  }
  
  const properties_Collection = await properties();
  const all_reviews = await properties_Collection.findOne({_id:ObjectId(propertyId)});
  if(!all_reviews) throw "No reviews found"
  let list = all_reviews.reviews;
 // if(!list || list.length===0) throw "Reviews not found"
  return JSON.parse(JSON.stringify(list));
};

module.exports = {
  createReview,
  getAllReviews
};
