// var logger = require('../common/logger');
//
// // Patch res.render method to output logger
// exports.render = function (req, res, next) {
//   res._render = res.render;
//
//   res.render = function (view, options, fn) {
//     var t = new Date();
//
//     res._render(view, options, fn);
//
//     var duration = (new Date() - t);
//     logger.info("Render view", view, ("(" + duration + "ms)").green);
//   };
//
//   next();
// };

var moment = require('moment');
var util = require('util');
var os = require('os');
var fs = require('fs')
var log4js = require('log4js')
var path = require('path')
var config = require('../config')

var logDirectory = config.render_log_dir;
var Logger = log4js.getLogger('render_log');
// var ignore = /^\/(public|agent)/;

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)


log4js.configure({
    levels: {
            'render_log': 'INFO',
            'console': 'INFO'
    },
    appenders:[
        {
                type: 'console',
                category: 'console'
        },
        {
                type: 'dateFile',
                filename: logDirectory + '/render', // 需要手动建好目录
                // maxLogSize: 1024, // 只在 type: 'file' 中才支持
                // backups: 3, // 默认为5，指定了pattern之后backups参数无效了，除非pattern是小于backups的数字，原理是不指定pattern时备份的文件是在文件名后面加'.n'的数字，n从1开始自增
                pattern: '-yyyy-MM-dd.log', // 指定pattern后无限备份
                alwaysIncludePattern: true, // 不指定pattern时若为true会使用默认值'.yyyy-MM-dd'
                category: 'render_log',
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

exports = module.exports = function (req, res, next) {
    res._render = res.render;

    res.render = function (view, options, fn) {
      var t = new Date();

      res._render(view, options, fn);

      var duration = (new Date() - t);
      msg = 'Render view ' +  view + ' duration ' + 'ms'
      Logger.info(msg)
    };

    next();
};
