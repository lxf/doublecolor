/**
 *配置文件
 */

var path = require('path');
var config = {
    app_name: '双色球',
    app_description: '双色球',
    app_keywords: '双色球',
    host: 'localhost',
    // mongodb 配置
    db: 'mongodb://name:pwd@ds059938.mongolab.com:59938/upsnail',
    //db:'mongodb://127.0.0.1/dc',
    // redis 配置，默认是本地
    redis_host: '127.0.0.1',
    redis_port: 8888,
    // 程序运行的端口
    port: 18080,
    host: '127.0.0.1',
    // 邮箱配置
    mail_opts: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'mspublic@126.com',
            pass: ''
        }
    }
};

module.exports = config;
