const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Tumblr reply: IronTumblr home page' });
});

module.exports = router;
