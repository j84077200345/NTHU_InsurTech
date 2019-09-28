const express = require('express');
const router = express.Router();

const firebaseAdminDB = require('../connections/firebase_admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: 'Express' });
});

module.exports = router;
