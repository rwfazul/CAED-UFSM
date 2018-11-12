var express = require('express');
var router = express.Router();
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
		res.render('admin/dashboard');
	})
	.get('/salas', function (req, res) {
		returnResponse({ name: 'salas' }, res, 'list-base', listBase + 'salas');
	})
	.get('/profissionais', function (req, res) {
		returnResponse({ name: 'profissionais' }, res, 'list-base', listBase + 'profissionais');
	})
	.get('/solicitacoes', function (req, res) {
		returnResponse({ name: 'solicitacoes' }, res, 'list-base', listBase + 'solicitacoes');
	})
	.get('/encaminhamentos', function (req, res) {
		returnResponse({ name: 'encaminhamentos' }, res, 'list-base', listBase + 'encaminhamentos');
	})
	.get('/agenda/profissionais', function (req, res) {
		returnResponse('', res, 'agenda-sala-picker');
	})
	.post('/agenda/profissionais/sala/:uri', function (req, res) {
		var sala = { id: req.body['id'], nome: req.body['nome'] };
		returnResponse({ sala: sala }, res, 'agenda-profissionais');
	})
	.get('/agenda/atendimentos', function (req, res) {
		returnResponse('', res, 'agenda-sala-picker');
	})
	.post('/agenda/atendimentos/sala/:uri', function (req, res) {
		var sala = { id: req.body['id'], nome: req.body['nome'] };
		returnResponse({ sala: sala }, res, 'agenda-atendimentos');
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
	});

function returnResponse(data, res, page, partial) {
	var response = {};
	if (partial) response.partial = 'partials/' + partial;
	if (data) response.data = data;
	res.render('admin/' + page, response);
}

function errorHandler(res, err) {
	res.render('errors/error_template', { page: 'extract-data', message: err });
}

module.exports = router;