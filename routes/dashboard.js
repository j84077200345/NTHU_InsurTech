var express = require('express');
var router = express.Router();

const firebaseAdminDB = require('../connections/firebase_admin');

/* GET users listing. */
router.get('/', function(req, res, next) {
  var uid = req.session.uid;
  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var name = snapshot.val().name;
    res.render('dashboard/info', { name });
  });
});

router.get('/admin', function(req, res, next) {
  res.render('dashboard/admin');
});

router.get('/account', function(req, res, next) {
  var uid = req.session.uid;
  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var addressList = snapshot.val().address;
    if(addressList == undefined) {
      addressList = {'message': 'You don\'t have any ethereum address yet !!'}
    }

    console.log(addressList);
    res.render('dashboard/account', { 
      uid,
      addressList
    });
  });
  
});

module.exports = router;
