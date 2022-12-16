const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties;
const property_data = require("./properties");

const createReview = async (
  propertyId,
  userId,
  review,
) => {
  if (!propertyId || !review|| !userId) {
    throw "No Input";
  }
  if (
    typeof propertyId != "string" ||
    //typeof propertyAddress != "string" ||
    typeof review != "string"  || typeof userId!= 'string'
  ) {
    throw "Parameters are not string";
  }

  if (
    propertyId.trim().length == 0 ||
    //propertyAddress.trim().length == 0 ||
    review.trim().length == 0
  ) {
    throw "Length should not be zero";
  }

  if (!ObjectId.isValid(propertyId)) {
    throw "Not a valid object id";
  }

  let data = await property_data.getPropertyById(propertyId);
  if (!data) {
    throw "No movie woth this id";
  }
  if (
    data.review == review
  ) {
    throw "every thing seems to be same";
  }

  //let reviewsDate = new Date().toLocaleDateString();

  const property_collection = await properties();
  const property = await property_collection.findOne({
    _id: ObjectId(propertyId),
  });
  if (!property) throw "Could not find movie";

  const new_Review = {
    _id: ObjectId(),
    propertyId: propertyId,
    userId:userId,
    review: review,
  };
  property.reviews.push(new_Review);

  //const newOverallRating = avaerage_ratings_movie(property.reviews);
  // const updatedInfo = await property_collection.updateOne(
  //   { _id: ObjectId(userId) },
  //   {
  //     $push: { reviews: new_Review },
  //     $set: { overallRating: newOverallRating },
  //   }
  // );
  if (updatedInfo.modifiedCount === 0) throw "Could not add review";
  // new_Review = new_Review._id.toString();
  // return new_Review;
  return JSON.parse(JSON.stringify(new_Review));
};
// const avaerage_ratings_movie = (reviews) => {
//   let deno = 0;
//   let sum = 0;

//   for (let i of reviews) {
//     sum += i.rating;
//     deno++;
//   }
//   let avg = sum / deno;
//   return Number(avg.toFixed(1));
// };

const removeReview = async (userId) => {
  if (!userId) {
    throw "No id";
  }
  if (typeof userId !== "string") throw "Not string datatype";
  if (userId.trim().length == 0) throw "lenght should not be zero";
  //objid = ObjectId(reviewId);
  if (!ObjectId.isValid(userId)) {
    throw "Not a valid object id";
  }
  const users_Collection = await users();
  const user_review = await users_Collection.findOne({
    "reviews.userId": ObjectId(userId),
  });
  if (!user_review) throw "No movie review";
  //re
  // const non_reviews = property_review.reviews.filter((curr_rev) => {
  //   return curr_rev._id.toString() !== reviewId;
  // });
  // let new_updated_rate = 0;
  // if (non_reviews.length > 0) {
  //   new_updated_rate = avaerage_ratings_movie(non_reviews);
  // }
  const prop = await property_Collection.findOne({})
  const updated_info = property_Collection.updateOne(
    { _id: property_review._id },
    {
      $pull: { reviews: { _id: ObjectId(userId) } }, //pulling first and then add set
      $set: { overallRating: new_updated_rate },
    }
  );
  if (updated_info.modifiedCount === 0) throw "Could not remove review";

  return `review of ${userId} is succesfully deleted`;
};

const getReview = async (propertyId) => {
  if (!propertyId) {
    throw "No id";
  }
  if (typeof propertyId !== "string") throw "Not string datatype";
  if (propertyId.trim().length == 0) throw "lenght should not be zero";
  //objid = ObjectId(reviewId);
  if (!ObjectId.isValid(propertyId)) {
    throw "Not a valid object id";
  }
  const property_Collection = await properties();
  const review = await property_Collection.findAll(
    { "reviews.propertyId": ObjectId(propertyId) },
    { projection: { _id: 0, "reviews": 1 } }
  );
  if (!review) throw "No reviews found with this particular id.";
  const [r] = review.reviews;
  return JSON.parse(JSON.stringify(r));
};

const getReviewbyUserId = async(userId) =>{
  const property_Collection = await properties();
  const review = await property_Collection.findAll(
    { "reviews.userId": ObjectId(userId) },
    { projection: { _id: 0, "reviews": 1 } }
  );
  if (!review) throw "No reviews found with this particular id.";
  const [r] = review.reviews;
  return JSON.parse(JSON.stringify(r));
}

module.exports = {
  createReview,
  getReview,
  removeReview,
  getReviewbyUserId
};
