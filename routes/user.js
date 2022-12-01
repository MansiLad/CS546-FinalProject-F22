const express = require('express')
const router = express.Router();
const path = require("path")
const data = require("../data/people")


router
  .route('/')
  .get(async (req, res) =>{
    res.sendFile(path.resolve("static/homepage.html"))
  })


router
  .route('/userLogin')
  .post(async (req, res) => {

  })

router
  .route('/userRegistration')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })

router
  .route('/propertyRegistration')
  .get(async (req, res) => {

  })
  .post(async (req, res) => {

  })





/* 
router.post('/', async (req, res) => {
  let blogPostData = req.body;
  let errors = [];

  if (!blogPostData.title) {
    errors.push('No title provided');
  }

  if (!blogPostData.body) {
    errors.push('No body provided');
  }

  if (!blogPostData.posterId) {
    errors.push('No poster selected');
  }

  if (errors.length > 0) {
    const users = await userData.getAllUsers();
    res.render('posts/new', {
      errors: errors,
      hasErrors: true,
      post: blogPostData,
      users: users
    });
    return;
  }

  try {
    const newPost = await postData.addPost(
      blogPostData.title,
      blogPostData.body,
      blogPostData.tags || [],
      blogPostData.posterId
    );

    res.redirect(`/posts/${newPost._id}`);
  } catch (e) {
    res.status(500).json({error: e});
  }
});
*/