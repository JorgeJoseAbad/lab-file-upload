const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const path       = require('path');
const multer     = require('multer');
const User       = require('../models/user');
const Post       = require('../models/post');
const fs         = require('fs');

const myUploaderPost = multer({
  dest: path.join(__dirname, '../public/uploads')
});


/*Complete list of CRUD routes for post*/

//route to list all post
  router.get('/',(req,res,next)=>{
    Post
      .find({})
      .populate('creatorId')
      .exec((err, posts) => {
        if (err) return err;
        console.log(posts);
        res.render('post/listpost', {posts,user:req.user});
      });

  });

//route to show new post form
router.get('/new',(req,res)=>{
  console.log(req.user);
  console.log(req.query);
  res.render('post/newpost',{user:req.user});
});


//route to save new post with post verb
router.post('/',myUploaderPost.single('file'),(req,res)=>{

  console.log(req.body);

  const newPost = new Post({
      content: req.body.content,
      creatorId: req.body.creatorId,
      picPath: `/uploads/${req.file.filename}`,
      picName: req.body.name
    });

  newPost.save((err)=>{
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    res.redirect('/');
  });

});

//route to show one sole post, for details for example, with all
// information of that post
router.get('/:id',function(req,res){
  var id=req.params.id;

  Post
    .findById({_id:id})
    .populate('creatorId')
    .populate('coments.authorId')
    .exec((err, post) => {
      if (err) return err;

      res.render('post/show', {post:post,user:req.user});
    });

});

//route to show edit post form (only content)
router.get('/:id/edit', function(req,res){
  var id=req.params.id;
  console.log("in get /:id:  "+id);

  Post.findById(id, (err, post) => {

    if (err) { return next(err); }
    res.render('post/edit', { post: post,user:req.user});
  });

});


//route to save edited post with post verb
router.post('/:id', function(req,res){
  var id=req.params.id;

  const updates = {
      content: req.body.content,
  };

  Post.findByIdAndUpdate(id, updates, (err, post) => {
    if (err){ return next(err); }
    return res.redirect('/');
  });
});


/* route to delete post and file from publics, fs.unlink of node.js*/
router.post('/:id/delete',function(req,res){

    console.log(req.params.id);
    const id = req.params.id;

    Post.findByIdAndRemove(id, (err, product) => {

      console.log(product.picPath);
      var picToDelete='public'+product.picPath;
      console.log(picToDelete);
      if (err){
        console.log(err);
        return next(err);
      } else {

        fs.unlink(picToDelete, (err) => {
          try{
            if (err) throw err;
          }
          catch (err){
            console.log(err);
          }
          finally {
            console.log("unlink made");
          }
        });
      }

      return res.redirect('/');
    });

});


module.exports = router;
