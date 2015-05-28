var mailer = require('nodemailer');
var config = require('../config/config');
var util = require('util');

var mail = mailer.createTransport(config.mail_opts);
var SITE_ROOT_URL = 'http://' + config.host;

var sendMail = function (data) {
    mail.sendMail(data, function (err) {
        if (err) {
            console.log(err);
        }
    });
};

exports.sendMail = sendMail;

/**
*发送激活邮件
*@param {String} who 接收人的邮件地址
*@param {String} token 重置用的token
*@param {String} name 接收人的名字
*/
exports.sendActiveMail = function (who, token, name) {
    var from = util.format('%s <%s>', config.name, config.mail_opts.auth.user);
    var to = who;
    var subject = config.app_name + ' 通讯录帐号激活';
    var html = '<p>您好：' + name + '</p>' +
    '<p>我们收到您在' + config.app_name + '的注册信息，请点击下面的链接来激活帐户：</p>' +
    '<a href="' + SITE_ROOT_URL + '/active_account?key=' + token + '&name=' + name + '">激活链接</a>' +
    '<p>若您没有在' + config.app_name + '填写过注册信息，说明有人滥用了您的电子邮箱，请删除此邮件，我们对给您造成的打扰感到抱歉。</p>' +
    '<p>' + config.app_name + ' 谨上。</p>';
    exports.sendMail({
        from: from,
        to: to,
        subject: subject,
        html: html
    });
};
