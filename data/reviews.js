const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const properties = mongoCollections.properties       ;
const property_data = require('./properties')

const createReview = async (
    propertyId,
    propertyName,
    reviewerName,
    review,
    rating // if proptery id will be need we will see later
  ) => {
  
    if(!propertyId || !propertyName || !reviewerName || !review || !rating){
      throw 'No Input';
    }
    if(typeof propertyId!= 'string' ||typeof propertyName!= 'string' ||typeof reviewerName!= 'string' ||typeof review!= 'string'){
      throw 'Parameters are not string';
    }
        
    if(propertyId.trim().length==0 || propertyName.trim().length==0 || reviewerName.trim().length==0 || review.trim().length==0){
      throw 'Length should not be zero';
    }
      
    if (!ObjectId.isValid(propertyId)){
      throw 'Not a valid object id'
    }
  
    let data = await property_data.getMovieById(propertyId);
    if(data == null){
      throw 'No movie woth this id';
    }
    if(data.propertyName==propertyName && data.reviewerName==reviewerName && data.review== review && data.rating==rating){
      throw 'every thing seems to be same';
    } 
  
    let rate = parseFloat(rating);
    //console.log(typeof rate)
    if(rate<1 || rate>5){
      throw "Not valid ratings"
    }
    let rrate = rate.toFixed(1);
    rrate = Number(rrate);
    let reviewsDate = new Date().toLocaleDateString();
    
  
    const property_collection = await properties();
    const property = await property_collection.findOne({_id:ObjectId(propertyId)});
    if(property === null) throw "Could not find movie"
  
     
    const new_Review = {
      _id: ObjectId(),
      propertyName: propertyName,
      reviewerName: reviewerName,
      review: review,
      rating: rrate,
      reviewDate : reviewsDate
  };
  property.reviews.push(new_Review);

const newOverallRating = avaerage_ratings_movie(property.reviews);
const updatedInfo = await property_collection.updateOne(
  { _id: ObjectId(userId) },
  {
      $push: { reviews: new_Review },
      $set: { overallRating: newOverallRating },
  }
);
if(updatedInfo.modifiedCount=== 0) throw "Could not add review"
// new_Review = new_Review._id.toString();
// return new_Review;
return JSON.parse(JSON.stringify(new_Review));

}
const avaerage_ratings_movie = (reviews) => {
    let deno = 0;
    let sum = 0;
  
    for (let i of reviews) {
        sum += i.rating;
        deno++;
    }
    let avg = sum/deno
    return Number(avg.toFixed(1));
};

const removeReview = async (reviewId) => {

    if(!reviewId){
      throw 'No id';
    }
    if(typeof reviewId !== 'string') throw 'Not string datatype';
    if(reviewId.trim().length==0) throw 'lenght should not be zero'
    //objid = ObjectId(reviewId);
    if (!ObjectId.isValid(reviewId)){
      throw 'Not a valid object id'
    }
    const property_Collection = await properties();
    const property_review = await property_Collection.findOne({"reviews._id": ObjectId(reviewId)});
    if (!property_review) throw "No movie review";
    //re
    const non_reviews = property_review.reviews.filter((curr_rev)=>{
      return curr_rev._id.toString() !== reviewId;
    })
    let new_updated_rate = 0;
    if(non_reviews.length>0){
      new_updated_rate = avaerage_ratings_movie(non_reviews);
    }
  const updated_info = property_Collection.updateOne(
    {_id:property_review._id},
    {
      $pull: {reviews:{_id:ObjectId(reviewId)}},//pulling first and then add set
      $set: {overallRating: new_updated_rate}
    }
  )
  if (updated_info.modifiedCount === 0) throw "Could not remove review"
  
  return `${reviewId} is succesfully deleted`;
  
  };


  const getReview = async (reviewId) => {
    if(!reviewId){
      throw 'No id';
    }
    if(typeof reviewId !== 'string') throw 'Not string datatype';
    if(reviewId.trim().length==0) throw 'lenght should not be zero'
    //objid = ObjectId(reviewId);
    if (!ObjectId.isValid(reviewId)){
      throw 'Not a valid object id'
    }
    const property_Collection = await properties();
    const review = await property_Collection.findOne({'reviews._id' : ObjectId(reviewId)},{projection:{_id:0,"reviews.$":1}});
    if(!review) throw "No reviews found with this particular id."
    const [r] = review.reviews;
    return JSON.parse(JSON.stringify(r));
  
  };

  module.exports = {
    createReview,
    getReview,
    removeReview
  };



