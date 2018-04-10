var moment = require('moment');
var util = require('util');
var os = require('os');
var fs = require('fs')
var log4js = require('log4js')
var path = require('path')
var config = require('../config')

var logDirectory = config.error_log_dir;
var Logger = log4js.getLogger('error_log');
console.log('logger_error');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

log4js.configure({
    levels: {
            'error_log': 'ERROR',
            'console': 'INFO'
    },
    appenders:[
        {
                type: 'console',
                category: 'console'
        },
        {
                type: 'dateFile',
                filename: logDirectory + '/error', // 需要手动建好目录
                // maxLogSize: 1024, // 只在 type: 'file' 中才支持
                // backups: 3, // 默认为5，指定了pattern之后backups参数无效了，除非pattern是小于backups的数字，原理是不指定pattern时备份的文件是在文件名后面加'.n'的数字，n从1开始自增
                pattern: '-yyyy-MM-dd.log', // 指定pattern后无限备份
                alwaysIncludePattern: true, // 不指定pattern时若为true会使用默认值'.yyyy-MM-dd'
                category: 'error_log',
                compress: true,
                encoding: 'utf-8'
        }
    ],
    replaceConsole: true
});

exports.errorLogger = function(msg){
        var ret = '';
        if(!msg)  {
            return ret;
        }
        var date=moment();
        var time=date.format('YYYY-MM-DD HH:mm:ss');
        if(msg instanceof Error){
            var err={
                name:msg.name,
                data:msg.data
            };
            err.start=msg.stack;
            ret = util.format('%s %s:%s\nHost:%s\nErrorData:%j\n',
                time,
                err.name,
                err.stack,
                os.hostname(),
                err.data
            );
        }else  {
            ret=time+''+util.format.apply(util,arguments)+'\n';
        }
        console.log(ret);
        Logger.error(ret)
        return ;
    };
