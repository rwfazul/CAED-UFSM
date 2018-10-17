var express = require('express');
var router = express.Router();
var extractor = require('../services/google-sheets-api/extractor');
var formatter = require('../services/google-sheets-api/formatter');
var list_formatter = require('../services/google-sheets-api/list_formatter');
var firestore = require('../services/firestore-api/firestore')

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
			if (err) return errorHandler(res, err);
			returnResponse(list_formatter(result), res, 'dashboard-base', listBase + 'solicitacoes');
		});	
	})
	.get('/encaminhamentos', function (req, res) {
		extractor.getSheetData(sheets.encaminhamentos, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(list_formatter(result), res, 'dashboard-base', listBase + 'encaminhamentos');
		});
	})
	.get('/agenda-salas', function (req, res) {
		extractor.getSheetData(sheets.servidores, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'agenda-salas');
		});	
	})
	.get('/agenda-atendimentos', function (req, res) {
		extractor.getSheetData(sheets.solicitacoes, function(result, err) {
			if (err) return errorHandler(res, err);
			returnResponse(formatter(result), res, 'agenda-atendimentos');
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

/* TODO: REFATORAR PARA ARQUIVO AGENDA.JS */
router.get('/servidor/', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-servidores');
	var allServidores = colRef.get()
		.then(snapshot => {
			var servidores = new Array();
			snapshot.forEach(doc => {
				// console.log(doc.id, '=>', doc.data());
				servidores.push(doc.data());
			});
			res.status(200).json(servidores);
    	})
    	.catch(err => {
     	 	console.log('Error getting documents', err);
     	 	res.status(501).send(err);
    	});
});

router.post('/servidor/save', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-servidores');
	var addDoc = colRef.add({
		title: req.body['title'],
		start: req.body['start'],
		end:   req.body['end']
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
		res.status(201).send(ref.id);
	}).catch(err => {
		console.log('Error in adding documents: ', err);
		res.status(501).send(err);
	});
});

router.get('/atendimento/', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-atendimentos');
	var allAtendimentos = colRef.get()
		.then(snapshot => {
			var atendimentos = new Array();
			snapshot.forEach(doc => {
				// console.log(doc.id, '=>', doc.data());
				atendimentos.push(doc.data());
			});
			res.status(200).json(atendimentos);
    	})
    	.catch(err => {
     	 	console.log('Error getting documents', err);
     	 	res.status(501).send(err);
    	});
});

router.post('/atendimento/save', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-atendimentos');
	var addDoc = colRef.add({
		title: req.body['title'],
		start: req.body['start'],
		end:   req.body['end']
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
		res.status(201).send(ref.id);
	}).catch(err => {
		console.log('Error in adding documents: ', err);
		res.status(501).send(err);
	});
});
/* */

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