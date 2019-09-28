const express = require('express');
const firebaseClient = require('../connections/firebase_client');

const router = express.Router();

require('dotenv').config();

router.get('/signup', function(req, res) {
    const messages = req.flash('error');
    res.render('dashboard/signup', { 
        messages,
        hasErrors: messages.length > 0
    });
});
  
router.post('/signup', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirm_password;
    if(password !== confirmPassword) {
        req.flash('error', 'Two Password need to be same')
        res.redirect('/auth/signup');
    };
  
    firebaseClient.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
      req.session.uid = user.user.uid;
      console.log('uid: ', req.session.uid);
      res.redirect('/auth/signin');
    }).catch(function(error) {
      console.log(error);
      req.flash('error', error.message);
      res.redirect('/auth/signup')
    });
});
  
router.get('/signin', function(req, res) {
    const messages = req.flash('error');
    res.render('dashboard/signin', { 
        messages,
        hasErrors: messages.length > 0
    });
});

router.post('/signin', function(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    firebaseClient.auth().signInWithEmailAndPassword(email, password).then(function(user) {
        req.session.uid = user.user.uid;
        req.session.email = req.body.email;
        console.log(req.session.uid);
        
        if(req.session.uid == process.env.ADMIN_UID) {
            res.redirect('/dashboard/admin');
        } else {
            res.redirect('/dashboard');
        }
    }).catch(function(error) {
        req.flash('error', error.message);
        res.redirect('/auth/signin');
    });
});

router.get('/signout', function(req, res) {
    req.session.uid = '';
    res.redirect('/auth/signin');
})

module.exports = router;