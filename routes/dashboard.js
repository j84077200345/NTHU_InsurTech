var express = require('express');
var router = express.Router();

const firebaseAdminDB = require('../connections/firebase_admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('dashboard/info');
});

router.get('/admin', function(req, res, next) {
  res.render('dashboard/admin');
});

module.exports = router;
