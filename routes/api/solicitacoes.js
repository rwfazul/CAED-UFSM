var express = require('express');
var router = express.Router();

var firestore = require('../../services/firestore-api/firestore');

const solicitacoesCollection = 'caed-solicitacoes';

// GET: /api/solicitacoes
router.get('/', function(req, res) {
	firestore.getAllDocs(solicitacoesCollection, function(docs, err) {
		if (err) res.status(500).send(err);
		else     res.status(200).json(docs);
	});
});

module.exports = router;