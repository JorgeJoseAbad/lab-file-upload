const express    = require('express');
const passport   = require('passport');
const router     = express.Router();
const path       = require('path');
const multer     = require('multer');
const User       = require('../models/user');
const bcrypt     = require('bcrypt');

const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');

const myUploader = multer({
  dest: path.join(__dirname, '../public/uploads')
});



router.get('/login', ensureLoggedOut(), (req, res) => {
    console.log("en router.get login");
    res.render('authentication/login', { message: req.flash('error')});
});

router.post('/login', ensureLoggedOut(), passport.authenticate('local-login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
  failureFlash : true
}));

router.get('/signup', ensureLoggedOut(), (req, res) => {
  console.log("intentamos ir a signup");
    res.render('authentication/signup', { message: req.flash('error')});
});

/*router.post('/signup', ensureLoggedOut(), passport.authenticate('local-signup', {
  successRedirect : '/',
  failureRedirect : '/signup',
  failureFlash : true
}));
*/


router.post('/signup', ensureLoggedOut(), myUploader.single('file'), (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    if (!password && !username) {
        res.render('authentication/signup', {
            message: 'PLease fill in the the require fields'
        });
        return;
    }
    User.findOne({
        'username': username
    }, (err, user) => {
        if (err) {
            return next(err);
        }

        if (user) {
            res.render('authentication/signup', {
                message: 'PLease pick another username yours is already in use'
            });
            return;
        } else {
            // Destructure the body

            const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            const newUser = new User({
                username: username,
                email: req.body.email,
                password: hashPass,
                profile_pic:{
                  pic_path: `/uploads/${req.file.filename}`,
                  pic_name: req.body.name
                }

            });

            newUser.save((err) => {
                if (err) {
                    next(err);
                    return;
                }
                req.flash('success','ok');
                res.redirect('/');
                return;
            });
        }

    });
});


router.get('/profile', ensureLoggedIn('/login'), (req, res) => {
    console.log("en route.get /profile req.user es:");
    console.log(req.user);
    res.render('authentication/profile', {
        user : req.user
    });
});

router.get('/logout', ensureLoggedIn('/login'), (req, res) => {
  console.log("en post logout");
    req.logout();
    res.redirect('/');
});



module.exports = router;
