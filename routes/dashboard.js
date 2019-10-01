var express = require('express');
var router = express.Router();

const firebaseAdminDB = require('../connections/firebase_admin');
const insurance_address = '0xa7B4960Ee77D64defbD2b0155ce828E4A8Bb6E75';

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

router.get('/account', function(req, res) {
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

router.get('/underwrite', function(req, res) {
  var uid = req.session.uid;
  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var addressList = snapshot.val().address;
    if(addressList == undefined) {
      addressList = {'message': 'You don\'t have any ethereum address yet !!'}
    }

    console.log(addressList);
    res.render('dashboard/underwrite', { 
      uid,
      addressList
    });
  });
});

router.post('/underwrite', function(req, res) {
  var uid = req.session.uid;
  var selectedAddress = req.body.selectAddress;

  firebaseAdminDB.ref('/users/' + uid + '/address').once('value', function(snapshot) {
    snapshot.forEach(function(data) {
      if(data.val()[0] == selectedAddress) {
        var prvKey = data.val()[1];
        var sData = JSON.stringify({
            "fromAddress": selectedAddress,
            "toAddress": insurance_address,
            "gasPrice": 21000000000,
            "gasLimit": 2100000,
            "value": 0.5,
            "privateKey" : prvKey,
            "data": "0xb01a4d8b0000000000000000000000000000000000000000000000000000000000000000"
        });
      
        fetch('https://api.cryptoapis.io/v1/bc/eth/rinkeby/txs/new-pvtkey', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': 'a418a13cf522402db6214a2c8a76413bc93f2f17'
            },
            body: sData
        }).then(function(response) {
            response.json().then(function(result) {
              var txHash = result.payload.hex;
              console.log(txHash);
              
              res.redirect(`/dashboard/underwrite/${txHash}`);
            });
        });
      }
    })
  });
});

router.get('/underwrite/:txHash', function(req, res) {
  const tx = req.param('txHash');
  var uid = req.session.uid;
  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var addressList = snapshot.val().address;
    if(addressList == undefined) {
      addressList = {'message': 'You don\'t have any ethereum address yet !!'}
    }

    res.render('dashboard/underwrite', { 
      uid,
      addressList,
      tx
    });
  });
});

module.exports = router;
