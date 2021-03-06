var fs = require('fs');
var async = require('async');
var _ = require("underscore")._;
var moment = require("moment");

var DCModel = require('../models/dc_model');
var DLTModel = require('../models/dlt_model');

//导入数据
exports.importData = function (req, res, next) {
    fs.readFile('public/files/data.txt', 'utf8', function (err, data) {
        if (err) throw err;
        var linesarr = data.split(/\r?\n/);

        async.eachSeries(
            linesarr,
            function (line, callback1) {
                var jsonobj = {};
                var arr = line.split(' ');
                if (arr.length == 9) {
                    jsonobj.no = arr[0];
                    var colorarr = arr[4].split(',');
                    jsonobj.r1 = colorarr[0];
                    jsonobj.r2 = colorarr[1];
                    jsonobj.r3 = colorarr[2];
                    jsonobj.r4 = colorarr[3];
                    jsonobj.r5 = colorarr[4];
                    jsonobj.r6 = colorarr[5];
                    jsonobj.b1 = colorarr[6];
                    jsonobj.date = arr[8];
                    DCModel.save(jsonobj);
                }
                callback1();
            },
            function (err) {

            }
            );
    });
};

//导入大乐透数据
exports.importDLTData = function (req, res, next) {
    fs.readFile('public/files/daletou.txt', 'utf8', function (err, data) {
        if (err) throw err;
        var linesarr = data.split(/\r?\n/);
        async.eachSeries(
            linesarr,
            function (line, callback1) {
                var jsonobj = {};
                var arr = line.split(' ');
                if (arr.length == 7) {
                    var colorarr = arr[6].split(',');
                    jsonobj.r1 = colorarr[0];
                    jsonobj.r2 = colorarr[1];
                    jsonobj.r3 = colorarr[2];
                    jsonobj.r4 = colorarr[3];
                    jsonobj.r5 = colorarr[4];
                    jsonobj.b1 = colorarr[5];
                    jsonobj.b2 = colorarr[6];
                    jsonobj.date = arr[0];
                    DLTModel.save(jsonobj);
                }
                callback1();
            },
            function (err) {

            }
            );
    });
};

function showDltData(limitnum, req, res, next) {
    var options = { skip: 0, sort: { 'no': -1 } };
    if (limitnum != null) {
        options.limit = limitnum;
    }

    DLTModel.getData({}, options, function (err, result) {
        var arr = [], tempmonth, tempday;
        _.each(result, function (item, index, list) {
            var obj = {};
            var str = item.date;
            tempmonth = str.getMonth() + 1;
            tempday = str.getDate();
            obj.date = str.getFullYear() + '-' + (tempmonth < 10 ? ('0' + tempmonth) : tempmonth) + '-' + (tempday < 10 ? ('0' + tempday) : tempday);
            obj.r1 = item.r1;
            obj.r2 = item.r2;
            obj.r3 = item.r3;
            obj.r4 = item.r4;
            obj.r5 = item.r5;
            obj.b1 = item.b1;
            obj.b2 = item.b2;
            arr.push(obj);
        });
        var temparr = _.sortBy(arr, 'date').reverse();
        res.render('dlt_index', { data: temparr });
    });
};

//显示大乐透
exports.showDLT = function (req, res, next) {
    showDltData(20, req, res, next);
};

exports.showDLTAll = function (req, res, next) {
    showDltData(null, req, res, next);
};

function showData(limitnum, req, res, next) {
    var options = { skip: 0, sort: { 'no': -1 } };
    if (limitnum != null) {
        options.limit = limitnum;
    }
    DCModel.getData({}, options, function (err, result) {
        var arr = [];
        _.each(result, function (item, index, list) {
            var obj = {};
            obj.no = item.no;
            obj.r1 = item.r1;
            obj.r2 = item.r2;
            obj.r3 = item.r3;
            obj.r4 = item.r4;
            obj.r5 = item.r5;
            obj.r6 = item.r6;
            obj.b1 = item.b1;
            arr.push(obj);
        });
        var temparr = _.sortBy(arr, 'no').reverse();
        res.render('dc_index', { data: temparr });
    });
};

//显示双色球
exports.showDC = function (req, res, next) {
    showData(20, req, res, next);
};

exports.showDCAll = function (req, res, next) {
    showData(null, req, res, next);
};

//显示数据导入页面
exports.showLoadData = function (req, res, next) {
    res.render('dc_import');
};

//显示双色球数据图表
exports.showDCImg = function (req, res, next) {
    res.render('dc_img');
};

//显示大乐透数据图表
exports.showDLTImg=function (req,res,next) {
    res.render('dlt_img');
};

//显示双色球前id期
exports.imgDCShowLimit = function (req, res, next) {
    if (req.params.id != undefined) {
        var options = { skip: 0, limit: req.params.id, sort: { 'no': -1 } };
        DCModel.getData({}, options, function (err, result) {
          if(err)
          {
              return next(err);
          }
          res.json(result);
        });
    }
};

//显示大乐透前id期
exports.imgDLTShowLimit=function (req,res,next) {
 if (req.params.id != undefined) {
        var options = { skip: 0, limit: req.params.id, sort: { 'no': -1 } };
        DLTModel.getData({}, options, function (err, result) {
          if(err)
          {
              return next(err);
          }
          res.json(result);
        });
    }
};