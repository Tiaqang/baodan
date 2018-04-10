var util = require('util');
var os = require('os');
var fs = require('fs')
var log4js = require('log4js')
var path = require('path')
var config = require('../config')

var logDirectory = config.request_log_dir;
var Logger = log4js.getLogger('request_log');
console.log('request_log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

log4js.configure({
    levels: {
            'request_log': 'INFO',
            'console': 'INFO'
    },
    appenders:[
        {
                type: 'console',
                category: 'console'
        },
        {
                type: 'dateFile',
                filename: logDirectory + '/request', // 需要手动建好目录
                // maxLogSize: 1024, // 只在 type: 'file' 中才支持
                // backups: 3, // 默认为5，指定了pattern之后backups参数无效了，除非pattern是小于backups的数字，原理是不指定pattern时备份的文件是在文件名后面加'.n'的数字，n从1开始自增
                pattern: '-yyyy-MM-dd.log', // 指定pattern后无限备份
                alwaysIncludePattern: true, // 不指定pattern时若为true会使用默认值'.yyyy-MM-dd'
                category: 'request_log',
                compress: true,
                encoding: 'utf-8'

                // type:'file',
                // filename:'logs/log4js.log',
                // 'maxLogSize':2048,
                // 'backups':3
        }
    ],
    replaceConsole: true
});
var ignore = /^\/(public|agent)/;
exports = module.exports = function (req, res, next) {

    // Assets do not out log.
    if (ignore.test(req.url)) {
      next();
      return;
    }
   //  Started 2018-03-26 10:37:15 POST /sendEmailCode ::ffff:127.0.0.1
   // [2018-03-26 10:37:15.130] [INFO] request_log - Completed duration 50ms

   var t = new Date();

   var msg ='Started ' + req.method + ' ' +  req.url + ' ' + ' ' + req.ip
   Logger.info(msg)

   res.on('finish',function(){
        var duration = (new Date() - t);
        msg = 'Completed duration ' + duration + 'ms\n'
        Logger.info(msg)
   })
    next();
};
