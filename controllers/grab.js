var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var path = require('path');

exports.grabHtml = function (req, res, next) {
    request('http://www.lecai.com/lottery/draw/list/50', function (error, response, body) {
        console.log(response.statusCode);
       
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            debugger;
            var obj = {};
          
            $('.historylist tbody tr').eq(0).find('td').map(function (index, ele) {
                if (index == 0)
                {
                    obj.no = $(this).text();
                }
                if (index == 1)
                {
                    obj.date = $(this).text().substring(0,10);
                }
                if (index == 2)
                {
                    $(this).find('em').map(function (_index, _ele) {
                        eval('obj.r' + (_index + 1) + '=' + $(this).text());
                    });
                    return;
                }
            })
            console.log(obj);
            //fs.writeFile(path.join(__dirname, 'log.txt'), obj, 'utf8', function (err) {
            //    if (err) throw err;
            //    console.log("写入成功!");
            //});
        }
    });
}

