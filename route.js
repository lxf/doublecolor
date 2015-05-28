var express = require('express');
var config = require('./config/config');
var router = express.Router();

var dc = require('./controllers/dc');
var robot = require('./controllers/grab');

router.post('/dc/dc_import',dc.importData);
router.post('/dc/dlt_import',dc.importDLTData);
router.get('/loaddata',dc.showLoadData);

router.get('/', dc.showDC);
router.get('/ssq', dc.showDC);
router.get('/dlt', dc.showDLT);

router.get('/grab', robot.grabHtml);

module.exports = router;