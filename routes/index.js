var express = require('express');
var router = express.Router();
const UserController = require('../controller/UserController');

/* GET ROUTES */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/register', function (req, res, next) {
  res.render('register');
});

// Protect the /blogs route using jwtverify middleware
router.get('/blogs', UserController.jwtverify, function (req, res, next) {
  res.render('blogs');  // Only accessible if the token is valid
});

/* POST ROUTES */
router.post('/register', UserController.UserRegister);
router.post('/login', UserController.UserLogin);

module.exports = router;
