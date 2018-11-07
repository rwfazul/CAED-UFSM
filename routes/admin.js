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
		extractor.setToken(req.body['token'], function (err) {
			if (err) return errorHandler(err);
			res.redirect('/admin/solicitacoes');
		});
	});

/* TODO: REFATORAR PARA ARQUIVO AGENDA.JS */
router.get('/profissional', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('caed-profissionais');
	var allDocs = colRef.get()
		.then(snapshot => {
			var profissionais = [];
			snapshot.forEach(doc => {
				// set 'id' key
				var profissional = doc.data();
				profissional.id = doc.id;
				profissionais.push(profissional);
			});
			res.status(200).json(profissionais);
    })
    .catch(err => {
    	console.log('Error getting documents', err);
     	 res.status(501).send(err);
    });
});

router.get('/profissional/agenda', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-profissionais');
	var allDocs = colRef.get()
		.then(snapshot => {
			var profissionais = [];
			snapshot.forEach(doc => {
				// set 'id' key
				var profissional = doc.data();
				profissional.id = doc.id;
				profissionais.push(profissional);
			});
			res.status(200).json(profissionais);
    })
    .catch(err => {
    	console.log('Error getting documents', err);
     	 res.status(501).send(err);
    });
});

router.post('/profissional/agenda/save', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-profissionais');
	var addDoc = colRef.add({
		title: req.body['title'],
		start: req.body['start'],
		end: req.body['end'],
		color: req.body['color'],
		_externalEventId: req.body['externalEventId']
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
		res.status(201).send(ref.id);
	}).catch(err => {
		console.log('Error in adding documents: ', err);
		res.status(501).send(err);
	});
});

router.post('/profissional/agenda/update', function(req, res) {
	var db = firestore.getDbInstace();
	var docRef = db.collection('salax-profissionais').doc(req.body['id']);
	var updateSingle = docRef.update({
		start: req.body['start'],
		end: req.body['end'],
	}).then(() => {
    	console.log("Document successfully updated!");
		res.status(200).send();
	}).catch(err => {
    	console.error("Error updating document: ", err);
		res.status(501).send(err);
	});
});

router.post('/profissional/agenda/delete', function(req, res) {
	var db = firestore.getDbInstace();
	var docRef = db.collection('salax-profissionais').doc(req.body['id']);

	var deleteDoc = docRef
		.delete()
		.then(() => {
			console.log("Document successfully deleted!");
			res.status(200).send();
		}).catch(err => {
			console.error("Error removing document: ", err);
			res.status(501).send(err);
		});
});

router.get('/solicitacao', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('caed-solicitacoes');
	var allDocs = colRef.get()
		.then(snapshot => {
			var solicitacoes = [];
			snapshot.forEach(doc => {
				// set 'id' key
				var solicitacao = doc.data();
				solicitacao.id = doc.id;
				solicitacoes.push(solicitacao);
			});
			res.status(200).json(solicitacoes);
    })
    .catch(err => {
     	 console.log('Error getting documents', err);
     	 res.status(501).send(err);
    });
});

router.get('/atendimento', function(req, res) {
	var db = firestore.getDbInstace();
	var colRef = db.collection('salax-atendimentos');
	var allDocs = colRef.get()
		.then(snapshot => {
			var atendimentos = [];
			snapshot.forEach(doc => {
				// set 'id' key
				var atendimento = doc.data();
				atendimento.id = doc.id;
				atendimentos.push(atendimento);
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
		end: req.body['end'],
		color: req.body['color'],
		_externalEventId: req.body['externalEventId']
	}).then(ref => {
		console.log('Added document with ID: ', ref.id);
		res.status(201).send(ref.id);
	}).catch(err => {
		console.log('Error in adding documents: ', err);
		res.status(501).send(err);
	});
});

router.post('/atendimento/update', function(req, res) {
	var db = firestore.getDbInstace();
	var docRef = db.collection('salax-atendimentos').doc(req.body['id']);
	var setWithMerge = docRef.set({
		start: req.body['start'],
		end: req.body['end'],
	}, { merge: true }).then(ref => {
    console.log("Document successfully written!");
		res.status(200).send();
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