const express = require('express')
const router = express.Router();
const path = require("path")
const data = require("../data")
const app = express();
const session = require('express-session');
const { ObjectId } = require("mongodb");
const review_data = data.reviews;
const userData = data.properties;
const xss = require('xss');
const validation = require('../helpers')

router
  .route('/:propertyId')
  .get(async (req, res) => {
    //code here for GET
    
    propertyId = req.params.propertyId
    
    try{
      const review = await review_data.getAllReviews(propertyId);
      propertyId = validation.checkId(propertyId)

      if(!review){
        return res.status(400).render("error",{error:'No reviews'})
      }
      if(review.length < 1){
        return res.status(400).render("error",{error:'No reviews'})
      }
      return res.render('propertyReviews', {title:'Reviews of the property', result: review});
      //res.status(200).render("error",review)
    }catch(e){
      res.status(404).render("error",{error: 'No reviews found with this movieId'})
    }
  })
  .post(async (req, res) => {
    //code here for POST
    try {
      propertyId = xss(req.params.propertyId)
      propertyId = validation.checkId(propertyId)
      let movie_get_id = await review_Data.getAllReviews(propertyId);
      if(!movie_get_id) throw 'No Review Data'
    } catch(e) {
      return res.status(404).render("error",{error:'Not found'})
    }
    let rev_data = req.body;
    //let movieId = req.params.movieId;
    reviewTitle = xss(rev_data.reviewTitle)
    reviewerName = xss(rev_data.reviewerName)
    review = xss(rev_data.review)
    rating = xss(rev_data.rating)
    try{
      if(!reviewTitle || !reviewerName || !review || !rating){
       throw "bad input 1"
      }
      if(typeof reviewTitle!='string' || typeof reviewerName!='string' || typeof review!='string'){
        throw "bad input 2"
      }
      if(reviewTitle.trim().length==0 || reviewerName.trim().length==0 || review.trim().length==0){
        throw "bad input 3"
      }
      let object_id = ObjectId(req.params.propertyId)
      if(!ObjectId.isValid(object_id)){
        throw "bad input 4"
      } 
      // let rate = rev_data.rating;
      // rate = parseFloat(rate);
      // if(rate<1 || rate>5){
      //   throw "bad input 5"
      // }
      // let rrate = rate.toFixed(1);
      // if(rrate<1.5 || rrate > 4.8){
      //   throw "bad input 6"
      // }
      // rrate = Number(rrate)
    }catch(e){
      return res.status(400).render("error",{ error: e });
    }
    try{
        let review = await review_data.createReview( 
        req.params.propertyId, 
        rev_data.reviewTitle, 
        // rev_data.reviewerName, 
        rev_data.review, 
        // rev_data.rating
      )
      return review;

      // let findMovie = await movieData.getMovieById(req.params.propertyId);
      // res.redirect('error')//what to do here..
      // //res.status(200).render("error",findMovie)
    }catch(e){
      res.status(404).render("error",{ error: 'review not found' });
    }
  });

router.route('/reviews').post(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render()
})

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
