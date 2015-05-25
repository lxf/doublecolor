var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyParser = require('body-parser');
var logger = require('morgan');
var flash = require('connect-flash');

var config = require('./config/config');

var accessLog = fs.createWriteStream('access.log', { flags: 'a' });

var app = express();

var approute = require('./route');

//加上这一段可以用req.body.xx去解析form表单中字段
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '100mb'
}));

//view engine jade
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(flash());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', approute);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
 app.listen(config.port, config.host, function () {
            console.log(new Date());
            console.log('在端口:' + app.get('port') + '监听!');
        });
