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

router.get('/blogs', function (req, res, next) {
  res.render('blogs');
});


/* POST ROUTES */

router.post('/register', UserController.UserRegister);
router.post('/login', UserController.UserLogin);
router.post('/blogs', UserController.UserLogin);


module.exports = router;
