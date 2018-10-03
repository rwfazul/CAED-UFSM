var express = require('express');
var router = express.Router();
var extract = require('../services/extract-sheets');

router
	.get('/', function (req, res) {
		res.render('admin/index');
	})
	.get('/logout', function (req, res) {
		res.render('admin/index');
	})
	.get('/dashboard', function (req, res) {
		res.render('admin/dashboard');
	})
	.get('/solicitacoes', function (req, res) {
		res.render('admin/agenda');
	})
	.get('/agenda', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/agenda', { data: error });
			else res.render('admin/agenda', { data: result });
		});
	})
	.get('/extract-sheets', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/table-extract-sheets', { data: error });
			else res.render('admin/table-extract-sheets', { data: result });
		});
	});

router.post('/login', function (req, res) {
	var usuario = req.body['usuario'];
	var senha = req.body['senha'];
	if (usuario == "admin" && senha == "admin") {
		res.render("admin/dashboard");
	}
	//como mudar url após encaminhar para página?	
});

module.exports = router;