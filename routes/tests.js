var express = require('express');
var router = express.Router();

router
	.get('/', function (req, res) {
		res.render('tests/index');
	})
	.get('/tasks', function (req, res) {
		res.render('tests/tasks');
	});

module.exports = router;