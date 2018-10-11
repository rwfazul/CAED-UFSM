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
	.get('/profissionais', function (req, res) {
		return getSheetData(sheets.servidores, 'list-profissionais', res);
	})
	.get('/solicitacoes', function (req, res) {
		return getSheetData(sheets.solicitacoes, 'list-solicitacoes', res);
	})
	.get('/encaminhamentos', function (req, res) {
		return getSheetData(sheets.encaminhamentos, 'list-encaminhamentos', res);
	})
	.get('/agenda', function (req, res) {
		extractor.getAuthClient(function (authClient, authUrl, credentialsErr) {
			if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
			else if (authUrl) {
				return res.render('admin/agenda', { authUrl: authUrl });
			}
			else {
				extractor.readSheet(authClient, sheets.solicitacoes, function (result, err) {
					if (err) { console.log('extract err:', err); }
					return res.render('admin/agenda', { data: formatResult(result) });
				})
			}
		});
	})
	.get('/test-solicitacoes', function (req, res) {
		extractor.getAuthClient(function (authClient, authUrl, credentialsErr) {
			if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
			else if (authUrl) {
				return res.render('admin/lists/test-solicitacoes', { authUrl: authUrl });
			}
			else {
				extractor.readSheet(authClient, sheets.solicitacoes, function (result, err) {
					if (err) { console.log('extract err:', err); }
					return res.render('admin/lists/test-solicitacoes', { data: formatResult(result) });
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
		res.render("admin/index", { msg: 'credentialsErr' });
	})
	.post('/storeToken', function (req, res) {
		extractor.setToken(req.body['token'], function (err) {
			console.log('ERROR???');
			if (err) console.log(err);
			else console.log('NAO')
			return res.redirect('/admin/solicitacoes');
		});
	});


function formatResult(result) {
	var nomes = [];
	var h1 = [];
	var h2 = [];
	var h3 = [];
	var h4 = [];
	var h5 = [];
	var h6 = [];
	var h7 = [];
	var h8 = [];
	var h9 = [];
	var matrix = [];


	if (result.length) {
		for (var row = 0; row < result.length; row++) {
			for (var col = 1; col < result[row].length; col++) {
				switch (result[0][col]) {
					case "Nome completo":
						nomes[row] = result[row][col];
					case "Horários livres [08h - 09h]":
						h1[row] = result[row][col].split(",");
					case "Horários livres [09h - 10h]":
						h2[row] = result[row][col].split(",");
					case "Horários livres [10h - 11h]":
						h3[row] = result[row][col].split(",");
					case "Horários livres [11h - 12h]":
						h4[row] = result[row][col].split(",");
					case "Horários livres [13h - 14h]":
						h5[row] = result[row][col].split(",");
					case "Horários livres [14h - 15h]":
						h6[row] = result[row][col].split(",");
					case "Horários livres [15h - 16h]":
						h7[row] = result[row][col].split(",");
					case "Horários livres [16h - 17h]":
						h8[row] = result[row][col].split(",");
					case "Horários livres [17h - 18h]":
						h9[row] = result[row][col].split(",");

				}
			}
		}
		matrix.push(nomes);
		matrix.push(h1);
		matrix.push(h2);
		matrix.push(h3);
		matrix.push(h4);
		matrix.push(h5);
		matrix.push(h6);
		matrix.push(h7);
		matrix.push(h8);
		matrix.push(h9);

		
		for (var row = 0; row < matrix.length; row++) {
			for (var col = 0; col < matrix[row].length; col++) {
				console.log("Linha ", row, "Coluna ", col, ":", matrix[row][col]);
			}
		}

	}
	
	return matrix;
}

function getSheetData(sheet, page, res) {
	extractor.getAuthClient(function (authClient, authUrl, credentialsErr) {
		if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
		else if (authUrl) {
			console.log('*** has url ***');
			return res.render('admin/dashboard-base', { page: page, authUrl: authUrl });
		}
		else {
			console.log('*** find token ***');
			extractor.readSheet(authClient, sheet, function (result, err) {
				if (err) { console.log('extract err:', err); }
				console.log('*** find data ***');
				return res.render('admin/dashboard-base', { page: page, data: result });
			})
		}
	});
}



module.exports = router;