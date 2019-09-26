const express = require('express');
const firebaseClient = require('../connections/firebase_client');

const router = express.Router();

router.get('/signup', (req, res) => {
    const messages = req.flash('error');
    res.render('dashboard/signup', {
        messages,
        hasErrors: messages.length > 0
    });
});

module.exports = router;