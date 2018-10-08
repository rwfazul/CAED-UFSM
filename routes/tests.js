var express = require('express');
var router = express.Router();

router
	.get('/', function (req, res) {
		res.render('tests/index', {next: '/tests/tasks', arrow: 'right'});
	})
	.get('/tasks', function (req, res) {
		res.render('tests/tasks', {next: '/tests', arrow: 'left'});
	});

module.exports = router;