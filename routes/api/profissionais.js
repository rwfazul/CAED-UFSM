var express = require('express');
var router  = express.Router();

var firestore = require('../../services/firestore-api/firestore');

router.get('/', function(req, res) {
	firestore.getAllDocs('caed-profissionais', function(docs, err) {
		if (err) res.status(500).send(err);
		else     res.status(200).json(docs);
	});
});

router.route('/agenda/:sala')
	.get(function(req, res) {
		firestore.getAllDocs(req.params.sala, function(docs, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docs);
		});
	})
	.post(function(req, res) {
		var doc = {
			title: req.body['title'],
			start: req.body['start'],
			end:   req.body['end'],
			color: req.body['color'],
			_externalEventId: req.body['externalEventId']
		};
		firestore.addDoc(req.params.sala, doc, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(201).json(docId);
		});	
	});

router.route('/agenda/:sala/:id')
	.put(function(req, res) {
		var doc = {
			start: req.body['start'],
			end:   req.body['end']
		};
		firestore.updateDoc(req.params.sala, req.params.id, doc, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docId);
		});	
	})
	.delete(function(req, res) {
		firestore.deleteDoc(req.params.sala, req.params.id, function(docId, err) {
			if (err) res.status(500).send(err);
			else     res.status(200).json(docId);
		});	
	});

module.exports = router;