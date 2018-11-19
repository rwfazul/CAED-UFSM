var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

// collections
const colAgenda = 'caed-agenda-atendimentos';

router
	.get('/agenda/:sala', function(req, res) {
		var query = ['_salaId', '==', req.params['sala']];
		firestore.getDocsWithFilter(colAgenda, query, function(docs, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docs);
		});
	})
	.post('/agenda', function(req, res) {
		var doc = {
			title: req.body['title'],
			start: req.body['start'],
			end:   req.body['end'],
			color: req.body['color'],
			_externalEventId: req.body['externalEventId'],
			_salaId: req.body['salaId'],
			_type: req.body['type']
		};
		firestore.addDoc(colAgenda, doc, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(201).json(docId);
		});	
	});

router.route('/agenda/:id')
	.put(function(req, res) {
		var doc = {
			start: req.body['start'],
			end:   req.body['end']
		};
		firestore.updateDoc(colAgenda, req.params.id, doc, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docId);
		});	
	})
	.delete(function(req, res) {
		firestore.deleteDoc(colAgenda, req.params.id, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docId);
		});	
	});

module.exports = router;