var express = require('express');
var router = express.Router();

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/772c5bb74c54405aa9a0718484d64b92"));

const firebaseAdminDB = require('../connections/firebase_admin');
const insurance_address = '0xa7B4960Ee77D64defbD2b0155ce828E4A8Bb6E75';

var insuranceContract = web3.eth.contract([ { "constant": false, "inputs": [ { "name": "severity", "type": "uint256" } ], "name": "confirmclaim", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "payPremium", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "payPremiumFor", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [], "name": "underwrite", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "update", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "constant": true, "inputs": [], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "contract_owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "insuranceTakers", "outputs": [ { "name": "banned", "type": "bool" }, { "name": "policyValid", "type": "bool" }, { "name": "lastPayment", "type": "uint256" }, { "name": "numAccidents", "type": "uint256" }, { "name": "totalPayment", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "insuranceTaker", "type": "address" } ], "name": "isInsured", "outputs": [ { "name": "insured", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "paymentPeriod", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "premiumPerYear", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ]);
insuranceInstance = insuranceContract.at(insurance_address);

/* GET users listing. */
router.get('/', function(req, res, next) {
  var uid = req.session.uid;
  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var name = snapshot.val().name;
    var addressList = snapshot.val().address;
    if(addressList == undefined) {
      addressList = {'message': 'You don\'t have any ethereum address yet !!'}
    }

    // get First Address
    // console.log(addressList[Object.keys(addressList)[0]][0]);
    
    fetch('https://api.cryptoapis.io/v1/bc/eth/rinkeby/address/' + addressList[Object.keys(addressList)[0]][0], {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'a418a13cf522402db6214a2c8a76413bc93f2f17'
      }
    }).then(function(response) {
      response.json().then(function(data) {
        var firstAddressMsg = data.payload;
        
        insuranceInstance.insuranceTakers.call(addressList[Object.keys(addressList)[0]][0], function(err, result) {
          var dt = new Date(Number(result[2])*1000);
          var year = dt.getFullYear();
          var month = dt.getMonth() + 1;
          var date = dt.getDate();
          var datetime;
          if(year < 2019) {
            datetime = 'null';
          } else {
            datetime = year + '/' + month + '/' + date
          }

          var insuranceStatus = {
            banned: result[0],
            policyValid: result[1],
            lastPayment: datetime,
            numAccidents: result[3].toFixed(0),
            totalPayment: result[4].toFixed(0) / 1000000000000000000 + ' ETH'
          }
          
          res.render('dashboard/info', {
            name,
            addressList,
            firstAddressMsg,
            insuranceStatus
          });
        });
      });
    });

  });
});

router.post('/', function(req, res) {
  var search = req.body.list;
  var uid = req.session.uid;

  firebaseAdminDB.ref('/users/' + uid).once('value', function(snapshot) {
    var name = snapshot.val().name;
    var addressList = snapshot.val().address;
    if(addressList == undefined) {
      addressList = {'message': 'You don\'t have any ethereum address yet !!'}
    }

    fetch('https://api.cryptoapis.io/v1/bc/eth/rinkeby/address/' + search, {
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'a418a13cf522402db6214a2c8a76413bc93f2f17'
      }
    }).then(function(response) {
      response.json().then(function(data) {
        var firstAddressMsg = data.payload;
        
        insuranceInstance.insuranceTakers.call(search, function(err, result) {
          var dt = new Date(Number(result[2])*1000);
          var year = dt.getFullYear();
          var month = dt.getMonth() + 1;
          var date = dt.getDate();
          var datetime;
          if(year < 2019) {
            datetime = 'null';
          } else {
            datetime = year + '/' + month + '/' + date
          }

          var insuranceStatus = {
            banned: result[0],
            policyValid: result[1],
            lastPayment: datetime,
            numAccidents: result[3].toFixed(0),
            totalPayment: result[4].toFixed(0) / 1000000000000000000 + ' ETH'
          }

          
          res.render('dashboard/info', {
            name,
            addressList,
            firstAddressMsg,
            insuranceStatus
          });
        });
      });
    });

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
