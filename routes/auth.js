const express = require('express');
const router  = express.Router();

var { authLocal } = require('../controllers/auth/authController');
const jwt = require('jsonwebtoken');

router
	.post('/login', function(req, res) {
		authLocal(req, res, function(err, user, info) {
			if (err || !user) return res.status(401).json(info); 
			req.logIn(user, { session: false }, function(err) {
				if (!err && req.user) {
					var token = jwt.sign({'id': req.user.id}, 'my_secret'); // change it
					res.cookie('jwt', token); 
					return res.status(200).send(token);
				}	
				return res.status(501).json(info);
			});
		});
    }).post('/logoff', function(req, res) {
		res.clearCookie('jwt');
		res.redirect('/caed/logout');
	});

module.exports = router;