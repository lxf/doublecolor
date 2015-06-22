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
router.get('/ssq/img', dc.showDCImg);
router.get('/ssq/all', dc.showDCAll);
router.get('/dlt', dc.showDLT);
router.get('/dlt/all', dc.showDLTAll);

//图表相关
//显示双色球前id期
router.get('/ssq/:id',dc.imgDCShowLimit);
//显示大乐透前id期
router.get('dlt/:id',dc.imgDLTShowLimit);


//抓取数据相关
router.get('/grab', robot.grabHtml);

module.exports = router;