var FileStreamRotator = require('file-stream-rotator')
var express = require('express')
var fs = require('fs')
var morgan = require('morgan')
var path = require('path')
var moment = require('moment')
var config = require('../config')
var app = express()
var logDirectory = config.access_log_dir;

// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
console.log('logger_access');
// 自定义token
morgan.token('time', function(req, res){
    var time = moment().format();
    return time;
});
// 自定义format，其中包含自定义的token
morgan.format('daily',':time :http-version :method :referrer  :remote-addr :remote-user :req[ip] :res[header] :response-time[0] :status :url :user-agent')

morgan.token('type', function (req, res) { return req.headers['content-type'] })
// create a rotating write stream
var accessLogStream = FileStreamRotator.getStream({
  date_format: 'YYYY-MM-DD',
  filename: path.join(logDirectory, 'access-%DATE%.log'),
  frequency: 'daily',
  verbose: false
})

module.exports = accessLogStream;
