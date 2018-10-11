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
		extractor.getAuthClient(function (authClient, authUrl, credentialsErr) {
			if (credentialsErr) { console.log('credentialsErr:', credentialsErr); }
			else if (authUrl) {
				console.log('*** has url ***');
				return res.render('admin/dashboard-base', { page: "list-profissionais", authUrl: authUrl });
			}
			else {
				console.log('*** find token ***');
				extractor.readSheet(authClient, sheets.servidores, function (result, err) {
					if (err) { console.log('extract err:', err); }
					console.log('*** find data ***');
					return res.render('admin/dashboard-base', { page: "list-profissionais", data: formatResult(result) });
				})
			}
		});
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
		matrix.push(arrayDaysBoolean(h1));
		matrix.push(arrayDaysBoolean(h2));
		matrix.push(arrayDaysBoolean(h3));
		matrix.push(arrayDaysBoolean(h4));
		matrix.push(arrayDaysBoolean(h5));
		matrix.push(arrayDaysBoolean(h6));
		matrix.push(arrayDaysBoolean(h7));
		matrix.push(arrayDaysBoolean(h8));
		matrix.push(arrayDaysBoolean(h9));

		for (var row = 0; row < matrix.length; row++) {
			for (var col = 0; col < matrix[row].length; col++) {
				console.log("Linha ", row, "Coluna ", col, ":", matrix[row][col]);
			}
		}

		var objectsEvents = [];
		objectsEvents = createArrayObjects(nomes, h1, h2, h3, h4, h5, h6, h7, h8, h9);

	}
	return matrix;
}

function arrayDaysBoolean(array) {
	var a = [array[0]];
	for (var r = 1; r < array.length; r++) {
		var v = [false, false, false, false, false];
		array[r].forEach((c) => {
			if (c.includes("Segunda-feira"))
				v[0] = true;
			if (c.includes("Terça-feira"))
				v[1] = true;
			if (c.includes("Quarta-feira"))
				v[2] = true;
			if (c.includes("Quinta-feira"))
				v[3] = true;
			if (c.includes("Sexta-feira"))
				v[4] = true;
		});
		a[r] = v;
	}
	return a;
}

function createArrayObjects(nomes, h1, h2, h3, h4, h5, h6, h7, h8, h9) {
	var objects = [];
	for (var r = 1; r < nomes.length; r++) {
		objects.push(createObjects(nomes[r], "08:00", arrayDaysInt(h1)[r]));
		objects.push(createObjects(nomes[r], "09:00", arrayDaysInt(h2)[r]));
		objects.push(createObjects(nomes[r], "10:00", arrayDaysInt(h3)[r]));
		objects.push(createObjects(nomes[r], "11:00", arrayDaysInt(h4)[r]));
		objects.push(createObjects(nomes[r], "13:00", arrayDaysInt(h5)[r]));
		objects.push(createObjects(nomes[r], "14:00", arrayDaysInt(h6)[r]));
		objects.push(createObjects(nomes[r], "15:00", arrayDaysInt(h7)[r]));
		objects.push(createObjects(nomes[r], "16:00", arrayDaysInt(h8)[r]));
		objects.push(createObjects(nomes[r], "17:00", arrayDaysInt(h9)[r]));
	}
	console.log(objects);
	return objects;
}

function createObjects(nome, hour, days) {
	var object = {};
	object.id = nome;
	object.start = hour;
	object.duration = "01:00";
	object.rendering = "background";
	object.dow = days;
	return object;
}

function arrayDaysInt(array) {
	var a = [];
	for (var r = 1; r < array.length; r++) {
		var v = [];
		array[r].forEach((c) => {
			if (c.includes("Segunda-feira"))
				v.push(1);
			if (c.includes("Terça-feira"))
				v.push(2);
			if (c.includes("Quarta-feira"))
				v.push(3);
			if (c.includes("Quinta-feira"))
				v.push(4);
			if (c.includes("Sexta-feira"))
				v.push(5);
		});
		a[r] = v;
	}
	return a;
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