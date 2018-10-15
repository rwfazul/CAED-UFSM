var express = require('express');
var router = express.Router();
var extractor = require('../services/google-sheets-api/extractor');
var formatter = require('../services/google-sheets-api/formatter');

const dashboardTemplate = 'dashboard_base';
const listBase = 'lists/list-';
const sheets = {
	servidores: {
		sheetId: '1030iyP9Z4FZVIkFCwqcJ4HvCHj4-XQzxReyjbVM3Sr0',
		sheetRange: 'Responses',
	},
	salas: {
		sheetId: '1Itqrdq8AENrc_yXG_IL3tDOaALRZYXEPWkqVC6wU6LI',
		sheetRange: 'Responses',
	},
	solicitacoes: {
		sheetId: '1Xyv_QKWnz-8QsFIHX5yTjQVoXL2IdK8SF6DB2kUeRlk',
		sheetRange: 'Responses',
	},
	encaminhamentos: {
		sheetId: '1jZJYoMaVuumahmEGP19a5BO4iNfKppMb-LvevLPtuPs',
		sheetRange: 'Responses',
	}
}

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
		extractor.getSheetData(sheets.salas, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'dashboard-base', listBase + 'salas');
		});	
	})
	.get('/profissionais', function (req, res) {
		extractor.getSheetData(sheets.servidores, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'dashboard-base', listBase +'profissionais');
		});	
	})
	.get('/solicitacoes', function (req, res) {
		extractor.getSheetData(sheets.solicitacoes, function(result, err) {
			if (err) return errorHandler(err);
			returnResponse(result, res, 'dashboard-base', listBase + 'solicitacoes');
		});	
	})
	.get('/encaminhamentos', function (req, res) {
		extractor.getSheetData(sheets.encaminhamentos, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(result, res, 'dashboard-base', listBase + 'encaminhamentos');
		});
	})
	.get('/agenda', function (req, res) {
		extractor.getSheetData(sheets.solicitacoes, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'agenda');
		});	
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
		extractor.setToken(req.body['token'], function (err) {
			if (err) return errorHandler(err);
			res.redirect('/admin/solicitacoes');
		});
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