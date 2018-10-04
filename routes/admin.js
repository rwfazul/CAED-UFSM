var express = require('express');
var router = express.Router();
var extractor = require('../services/google-sheets-api/extractor');

var path = 'services/google-sheets-api/tokens';
var sheets = {
	servidores: {
		sheetId: '1030iyP9Z4FZVIkFCwqcJ4HvCHj4-XQzxReyjbVM3Sr0',
		sheetRange: 'Responses',
		tokenPath: path + '/sheet-servidores.json'
	},
	salas: {
		sheetId: '1Itqrdq8AENrc_yXG_IL3tDOaALRZYXEPWkqVC6wU6LI',
		sheetRange: 'Responses',
		tokenPath: path + '/sheet-salas.json'
	},
	solicitacoes: {
		sheetId: '1Xyv_QKWnz-8QsFIHX5yTjQVoXL2IdK8SF6DB2kUeRlk',
		sheetRange: 'Responses',
		tokenPath: path + '/sheet-solicitacoes.json'
	},
	encaminhamentos: {
		sheetId: '1jZJYoMaVuumahmEGP19a5BO4iNfKppMb-LvevLPtuPs',
		sheetRange: 'Responses',
		tokenPath: path + '/sheet-encaminhamentos.json'
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
		getSheetData(sheets.salas, 'list-salas', res);
	})
	.get('/servidores', function (req, res) {
		getSheetData(sheets.servidores, 'list-servidores', res);
	})
	.get('/solicitacoes', function (req, res) {
		getSheetData(sheets.solicitacoes, 'list-solicitacoes', res);
	})
	.get('/encaminhamentos', function (req, res) {
		getSheetData(sheets.encaminhamentos, 'list-encaminhamentos', res);
	})
	.get('/agenda', function (req, res) {
		res.render('admin/agenda');
	});

router.post('/login', function (req, res) {
	var usuario = req.body['usuario'];
	var senha = req.body['senha'];
	if (usuario == "admin" && senha == "admin") {
		res.render("admin/dashboard");
	}
});

function getSheetData(sheet, page, res) {
	extractor.getAuthClient(sheet, function(authClient, authUrl, credentialsErr) {
	  if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
	  else if (authUrl) { 
	  	res.render('admin/dashboard-base', { page: page, authUrl: authUrl });
	  }
	  else {
	    extractor.readSheet(authClient, sheet, function(result, err) {
	    	res.render('admin/dashboard-base', { page: page, data: err ? err : result });
	    })
	  }
	});
}

module.exports = router;