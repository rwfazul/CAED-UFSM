var express = require('express');
var router  = express.Router();

router.use('/salas', require('./salas'));
router.use('/profissionais', require('./profissionais'));
router.use('/solicitacoes', require('./solicitacoes'));
router.use('/atendimentos', require('./atendimentos'));
router.use('/encaminhamentos', require('./encaminhamentos'));

module.exports = router;