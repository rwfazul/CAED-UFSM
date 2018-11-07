var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

const salasCollection = 'caed-salas';

// GET: /api/salas
router.get('/', function(req, res) {
	firestore.getAllDocs(salasCollection, function(docs, err) {
		if (err) res.status(500).send(err);
		else     res.status(200).json(docs);
	});
});

module.exports = router;