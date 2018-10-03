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
	.get('/agenda', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/agenda', { data: error });
			else res.render('admin/agenda', { data: result });
		});
	})
	.get('/list-salas', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/list-salas', { data: error });
			else res.render('admin/list-salas', { data: result });
		});
	})
	.get('/list-servidores', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/list-servidores', { data: error });
			else res.render('admin/list-servidores', { data: result });
		});
	})
	.get('/list-solicitacoes', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/list-solicitacoes', { data: error });
			else res.render('admin/list-solicitacoes', { data: result });
		});
	})
	.get('/list-encaminhamentos', function (req, res) {
		extract(function (result, error) {
			if (error) res.render('admin/list-encaminhamentos', { data: error });
			else res.render('admin/list-encaminhamentos', { data: result });
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
});

module.exports = router;