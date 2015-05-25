var express = require('express');
var config = require('./config/config');
var router = express.Router();

var dc = require('./controllers/dc');

router.post('/dc/dc_import',dc.importData);
router.get('/loaddata',dc.showLoadData);

router.get('/ssq',dc.showDC);
router.get('/dlt',dc.showDLT);
module.exports = router;