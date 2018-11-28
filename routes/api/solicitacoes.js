var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

const colSolicitacoes = 'caed-solicitacoes';

// GET: /api/solicitacoes
router
	.get('/', function (req, res) {
		firestore.getAllDocs(colSolicitacoes, function (docs, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docs);
		});
	})
	.get('/getpages', function (req, res) {
		var filter = ['agendado', '==', false];
		firestore.getDocsWithFilter(colSolicitacoes, filter, function (docs, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docs);
		});
	})
	.get('/getcount/:year', function (req, res) {
		firestore.getCount(colSolicitacoes, req.params['year'], function (docs, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docs);
		});
	})
	.get('/:page', function (req, res) {
		var filter = ['agendado', '==', false];
		var order = ['ultimaModificacao', 'timestamp'];
		firestore.getDocsPagination(colSolicitacoes, order, filter, req.params['page'], function (docs, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docs);
		});
	});

router.route('/:id')
	.delete(function (req, res) {
		firestore.deleteDoc(colSolicitacoes, req.params.id, function (docId, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docId);
		});
	})
	.put(function (req, res) {
		var doc = {
			agendado: req.body['agendado'] == "true" ? true : false,
			ultimaModificacao: req.body['ultimaModificacao']
		};
		firestore.updateDoc(colSolicitacoes, req.params.id, doc, function (docId, err) {
			if (err) res.status(500).send(err);
			else res.status(200).json(docId);
		});
	})

module.exports = router;