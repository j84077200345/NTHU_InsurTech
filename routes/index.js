var express = require('express');
var router = express.Router();
var firebaseAdminDB = require('../connections/firebase_admin');

firebaseAdminDB.ref('any').once('value', function(snapshot) {
  console.log(snapshot.val());
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});

// router.get('/dashboard/info', function(req, res, next) {
//   res.render('dashboard/info', { title: 'Express' });
// });

module.exports = router;
