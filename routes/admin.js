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
	//	extractor.getSheetData(sheets.salas, function(result, err) {
	//		if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'dashboard-base', listBase + 'salas');
	//	});	
	})
	.get('/profissionais', function (req, res) {
	//	extractor.getSheetData(sheets.servidores, function(result, err) {
	//		if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'dashboard-base', listBase +'profissionais');
	//	});	
	})
	.get('/solicitacoes', function (req, res) {
	//	extractor.getSheetData(sheets.solicitacoes, function(result, err) {
	//		if (err) return errorHandler(res, err);
			returnResponse(list_formatter(result), res, 'dashboard-base', listBase + 'solicitacoes');
	//	});	
	})
	.get('/encaminhamentos', function (req, res) {
		//extractor.getSheetData(sheets.encaminhamentos, function(result, err) {
		//	if (err) return errorHandler(res, err);
			returnResponse(list_formatter(result), res, 'dashboard-base', listBase + 'encaminhamentos');
		//});
	})
	.get('/agenda-salas', function (req, res) {
		//extractor.getSheetData(sheets.servidores, function(result, err) {
			//if (err) return errorHandler(res, err);
			returnResponse('', res, 'agenda-salas');
		//});	
	})
	.get('/agenda-atendimentos', function (req, res) {
		//extractor.getSheetData(sheets.solicitacoes, function(result, err) {
			//if (err) return errorHandler(res, err);
			returnResponse('', res, 'agenda-atendimentos');
		//});	
	})
	.get('/relatorios', function (req, res) {
		res.render('admin/relatorios');
	});

router
	.post('/login', function(req, res) {
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

function returnResponse(result, res, page, partial) {
	var response = {};
	if (result.authUrl) partial = 'read-token';
	if (partial) 	 	response.partial =  'partials/' + partial;
	if (result) 		response.data = result;
	res.render('admin/' + page, response);
}

function errorHandler(res, err) {
	res.render('errors/error_template', { page: 'extract-data', message: err });
}

module.exports = router;