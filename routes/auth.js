const express = require('express');
const router  = express.Router();

var { authLocal } = require('../controllers/auth/authController');
const jwt = require('jsonwebtoken');

router
	.post('/login', function(req, res) {
    	authLocal(req, res);
    	if (req.user) {
	        var token = jwt.sign({'id': req.user.id}, 'my_secret');
	        res.cookie('jwt', token); 
	        res.status(200).send(token);
	    }
    }).post('/logoff', function(req, res) {
		res.clearCookie('jwt');
		res.redirect('/caed/logout');
	});

module.exports = router;