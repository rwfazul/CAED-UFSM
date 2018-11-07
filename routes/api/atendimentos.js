var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

router.route('/')
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
	})
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