var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var path = require('path');
var DCModel = require('../models/dc_model');
var DLTModel = require('../models/dlt_model');
var rand = Math.floor(Math.random() * 100000000).toString();
exports.grabHtml = function (req, res, next) {
    //抓取大乐透数据
    request('http://caipiao.163.com/award/dlt/', function (error, response, body) {
        console.log('大乐透' + response.statusCode+" 抓取时间:"+new Date());
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var obj = {};
            $('#zj_area .red_ball').map(function (index, ele) {
                eval('obj.r' + (index + 1) + '=' + $(this).text());
            });
            $('#zj_area .blue_ball').map(function (index, ele) {
                eval('obj.b' + (index + 1) + '=' + $(this).text());
            });
            obj.no = $('#date_no').text();
            obj.date = $('#time').text().substring(0, 10);
            DLTModel.getData({ 'no': obj.no }, {}, function (err, result) {
                if (result.length == 0) {
                    DLTModel.save(obj);
                }
            });
        }
    });

    request('http://www.lecai.com/lottery/draw/list/50', function (error, response, body) {
        console.log('双色球' + response.statusCode+" 抓取时间:"+new Date());
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            var obj = {};
            $('.historylist tbody tr').eq(0).find('td').map(function (index, ele) {
                if (index == 0) {
                    obj.no = $(this).text();
                }
                if (index == 1) {
                    obj.date = $(this).text().substring(0, 10);
                }
                if (index == 2) {
                    $(this).find('em').map(function (_index, _ele) {
                        if (_index < 6) {
                            eval('obj.r' + (_index + 1) + '=' + $(this).text());
                        }
                        else {
                            eval('obj.b' + (_index - 5) + '=' + $(this).text());
                        }
                    });
                    return;
                }
            });
            DCModel.getData({ 'no': obj.no }, {}, function (err, result) {
                if (result.length == 0) {
                    DCModel.save(obj);
                }
            });
//            fs.writeFile(path.join(__dirname, 'log.txt'), obj, 'utf8', function (err) {
//                if (err) throw err;
//                console.log("写入成功!");
//            });
//测试
        }
    });
}

