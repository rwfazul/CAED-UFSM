var express = require('express');
var router = express.Router();
var extractor = require('../services/google-sheets-api/extractor');
var formatter = require('../services/google-sheets-api/formatter');
var list_formatter = require('../services/google-sheets-api/list_formatter');
var firestore = require('../services/firestore-api/firestore');

const dashboardTemplate = 'dashboard_base';
const listBase = 'lists/list-';

/*
// invoked for any requested passed to this router
router.use(function(req, res, next) {
  // middleware logic (auth)
  next();
});
*/

router
	.get('/', function (req, res) {
		res.render('admin/index');
	})
	.get('/logout', function (req, res) {
		res.render('admin/index');
	})
	.get('/dashboard', function (req, res) {
		res.render('admin/dashboard-base');
	})
	.get('/salas', function (req, res) {
		returnResponse('', res, 'dashboard-base', listBase + 'salas');
	})
	.get('/profissionais', function (req, res) {
		returnResponse('', res, 'dashboard-base', listBase + 'profissionais');
	})
	.get('/solicitacoes', function (req, res) {
		returnResponse('', res, 'dashboard-base', listBase + 'solicitacoes');
	})
	.get('/encaminhamentos', function (req, res) {
		returnResponse('', res, 'dashboard-base', listBase + 'encaminhamentos');
	})
	.get('/agenda/profissionais', function (req, res) {
		returnResponse('', res, 'agenda-profissionais');
	})
	.post('/agenda/profissionais/sala/:uri', function (req, res) {
		var data = { id: req.body['id'], nome: req.body['nome'] };
		returnResponse({ sala: data }, res, 'agenda-profissionais-salas');
	})
	.get('/agenda/atendimentos', function (req, res) {
		returnResponse('', res, 'agenda-atendimentos');
	})
	.post('/agenda/atendimentos/sala/:uri', function (req, res) {
		var data = { id: req.body['id'], nome: req.body['nome'] };
		returnResponse({ sala: data }, res, 'agenda-atendimentos-salas');
	})
	.get('/relatorios', function (req, res) {
		res.render('admin/relatorios');
	});

router
	.post('/login', function (req, res) {
		var usuario = req.body['usuario'];
		var senha = req.body['senha'];
		if (usuario == "admin" && senha == "admin") {
			res.render("admin/dashboard-base");
		}
		res.render("admin/index", { msg: 'credentialsErr' });
	})
	.post('/storeToken', function (req, res) {
		//	extractor.setToken(req.body['token'], function (err) {
		//		if (err) return errorHandler(err);
		res.redirect('/admin/solicitacoes');
		//	});
	});

function returnResponse(data, res, page, partial) {
	var response = {};
	if (data.authUrl) partial = 'read-token';
	if (partial) response.partial = 'partials/' + partial;
	if (data) response.data = data;
	res.render('admin/' + page, response);
}

function errorHandler(res, err) {
	res.render('errors/error_template', { page: 'extract-data', message: err });
}

module.exports = router;