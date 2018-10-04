var express = require('express');
var router = express.Router();
var extractor = require('../services/google-sheets-api/extractor');

var sheets = {
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
		return getSheetData(sheets.salas, 'list-salas', res);
	})
	.get('/servidores', function (req, res) {
		return getSheetData(sheets.servidores, 'list-servidores', res);
	})
	.get('/solicitacoes', function (req, res) {
		return getSheetData(sheets.solicitacoes, 'list-solicitacoes', res);
	})
	.get('/encaminhamentos', function (req, res) {
		return getSheetData(sheets.encaminhamentos, 'list-encaminhamentos', res);
	})
	.get('/agenda', function (req, res) {
		extractor.getAuthClient(function(authClient, authUrl, credentialsErr) {
		  if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
		  else if (authUrl) { 
		  	return res.render('admin/agenda', { authUrl: authUrl });
		  }
		  else {
		    extractor.readSheet(authClient, sheets.solicitacoes, function(result, err) {
		    	if (err) { console.log('extract err:', err); }
		    	return res.render('admin/agenda', { data: result });
		    })
		  }
		});
	});

router
	.post('/login', function (req, res) {
		var usuario = req.body['usuario'];
		var senha = req.body['senha'];
		if (usuario == "admin" && senha == "admin") {
			res.render("admin/dashboard-base");
		}
		res.render("admin/index", { msg: 'credentialsErr'});
	})
	.post('/storeToken', function(req, res) {
		extractor.setToken(req.body['token'], function(err) {
			console.log('ERROR???');
			if (err) console.log(err);
			else console.log('NAO')
			return res.redirect('/admin/solicitacoes');
		});
	});

function getSheetData(sheet, page, res) {
	extractor.getAuthClient(function(authClient, authUrl, credentialsErr) {
	  if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
	  else if (authUrl) { 
	  	console.log('*** has url ***');
	  	return res.render('admin/dashboard-base', { page: page, authUrl: authUrl });
	  }
	  else {
	  	console.log('*** find token ***');
	    extractor.readSheet(authClient, sheet, function(result, err) {
	    	if (err) { console.log('extract err:', err); }
	    	console.log('*** find data ***');
	    	return res.render('admin/dashboard-base', { page: page, data: result });
	    })
	  }
	});
}

module.exports = router;