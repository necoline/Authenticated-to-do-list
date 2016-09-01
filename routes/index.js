var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

function isAuthenticated(req, res, next) {
  if (req.user)
    return next();
  else
   res.redirect('/');
};

router.get('/planning', isAuthenticated, (req, res) => {
  res.render('planning', { user: req.user} );
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express',  user : req.user});
});

router.get('/about', (req, res) => {
  res.render('about', {user: req.user});
});

router.get('/register', (req, res) => {
  if (req.user)
   return res.back();
 res.render('register', { });
});

router.post('/register', (req, res) => {
  User.register(new User({ username : req.body.username }), req.body.password, (err, user) => {
    if (err) {
      return res.render('register', { user : user });
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/planning');
    });
  });
});

router.post('/login', passport.authenticate(
  'local',
  {successRedirect: '/planning', failureRedirect: '/'}
  ),
  (req, res) => {
  res.redirect('/planning');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
