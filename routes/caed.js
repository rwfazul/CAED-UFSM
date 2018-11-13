var express = require('express');
var router = express.Router();
var passport = require('passport');

var { authJwtFoward } = require('../controllers/auth/authController');


router.use(function(req, res, next) {
	authJwtFoward(req, res, next);
});

router
	.get(['/', '/login'], function(req, res) {
		console.log('/login');
		res.render('login/index');
	})
	.get('/logout', function(req, res) {
		res.render('login/index', { logout: true });
	});

module.exports = router;