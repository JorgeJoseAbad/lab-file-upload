const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const path       = require('path');
const multer     = require('multer');
const User       = require('../models/user');
const Post       = require('../models/post');
const Coment     = require('../models/coment');

const fs         = require('fs');



console.log("in post-comments");

//get route no show form for new coment
router.get('/:postId/coment/new', (req, res, next) => {
  console.log("in get /:postId/coments/new");
  let postId = req.params.postId;

  Post.findById(postId, (err, post) => {
    if (err) { next(err); }
    res.render('coments/new', { post: post,user:req.user });
  });
});

//post route to save new coment in post
router.post('/:postId/coments', (req, res, next) => {
  let postId = req.params.postId;

  Post.findById(postId, (err, post) => {
    const newComent = new Coment({
      content: req.body.content,
      authorId: req.body.authorId
    });
    console.log(newComent);

    post.coments.push(newComent);

    console.log(post);

    post.save((err) => {
      if (err) {console.log("error en save");
                console.log(err);}
      res.redirect(`/post/${post._id}`);
    });
  });
});



module.exports = router;
