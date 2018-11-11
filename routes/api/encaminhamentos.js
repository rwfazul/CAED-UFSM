var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

const encaminhamentosCollection = 'caed-solicitacoes';

// GET: /api/encaminhamentos
router.get('/', function(req, res) {
	firestore.getAllDocs(encaminhamentosCollection, function(docs, err) {
		if (err) res.status(500).send(err);
		else     res.status(200).json(docs);
	});
});

module.exports = router;