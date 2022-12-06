const express = require('express')
const router = express.Router();
const path = require("path")
const data = require("../data")
const app = express();
const session = require('express-session');
const { ObjectId } = require("mongodb");
const review_data = data.reviews;
const userData = data.properties;

router
  .route('/:propertyId')
  .get(async (req, res) => {
    //code here for GET
    
    try{
      const review = await review_data.getAllReviews(req.params.propertyId);
      if(!req.params.propertyId){
        return res.status(400).json({error:'Not valid propertyId'})
      }
      let object_id = ObjectId(req.params.propertyId)
      if(!ObjectId.isValid(object_id)){
        return res.status(400).json({error:'Not valid object id'})
      }
      if(!review){
        return res.status(400).json({error:'No reviews'})
      }
      if(review.length < 1){
        return res.status(400).json({error:'No reviews'})
      }
      return res.render('propertyReviews', {title:'Reviews of the property'});
      //res.status(200).json(review)
    }catch(e){
      res.status(404).json({error: 'No reviews found with this movieId'})
    }
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      if(!req.params.propertyId){
        return res.status(400).send('No id')
      }
      let movie_get_id = await movieData.getMovieById(req.params.propertyId);
    } catch(e) {
      return res.status(404).json({error:'Not found'})
    }
    let rev_data = req.body;
    //let movieId = req.params.movieId;
    try{
      if(!rev_data.reviewTitle || !rev_data.reviewerName || !rev_data.review || !rev_data.rating){
       throw "bad input 1"
      }
      if(typeof rev_data.reviewTitle!='string' || typeof rev_data.reviewerName!='string' || typeof rev_data.review!='string'){
        throw "bad input 2"
      }
      if(rev_data.reviewTitle.trim().length==0 || rev_data.reviewerName.trim().length==0 || rev_data.review.trim().length==0){
        throw "bad input 3"
      }
      let object_id = ObjectId(req.params.propertyId)
      if(!ObjectId.isValid(object_id)){
        throw "bad input 4"
      } 
      let rate = rev_data.rating;
      rate = parseFloat(rate);
      if(rate<1 || rate>5){
        throw "bad input 5"
      }
      let rrate = rate.toFixed(1);
      if(rrate<1.5 || rrate > 4.8){
        throw "bad input 6"
      }
      // rrate = Number(rrate)
    }catch(e){
      return res.status(400).json({ error: e });
    }

    try{
        let review = await review_data.createReview( 
        req.params.propertyId, 
        rev_data.reviewTitle, 
        rev_data.reviewerName, 
        rev_data.review, 
        rev_data.rating
      )

      let findMovie = await movieData.getMovieById(req.params.propertyId);
      res.redirect('error')//what to do here..
      //res.status(200).json(findMovie)
    }catch(e){
      res.status(404).json({ error: 'review not found' });
    }
  });

router
//get ka dalna hai??
  .route('/review/:reviewId')
  .get(async (req, res) => {
    //code here for GET
    try{
      let object_id = ObjectId(req.params.reviewId)
      if(!ObjectId.isValid(object_id)){
        throw "not valid object id"
      }
    }catch(e){
      return res.status(400).json({error: e})
    }
    
    
    try{
      const review = await review_data.getReview(req.params.reviewId);
      res.status(200).json(review)
    }catch(e){
      res.status(404).json({error:'No reviewId found'})
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    try {
      if(!req.params.reviewId){
        return res.status(400).json({error:'Not valid id'})
      }
      let object_id = ObjectId(req.params.reviewId)
      if(!ObjectId.isValid(object_id)){
      return res.status(400).json({error:'Not valid object id'})
    }
    let review_of_movie_id_del = await review_data.getReview(req.params.reviewId);
    if(!review_of_movie_id_del){
      return res.status(400).json({error:'No review id'})
    }
      let review = review_data.removeReview(req.params.reviewId);
      //res.status(200).json({review_id:review_of_movie_id_del._id, deleted:true})
      return res.render('deleted', {title:'Delete', msg:'The Review has been deleted!'})
    }
    catch (e){
      res.status(404).json({ error: 'Not found' });
    }
  });

  
  module.exports= router;
