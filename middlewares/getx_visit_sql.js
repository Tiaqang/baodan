var eventproxy     = require('eventproxy');
var config         = require('../config');
var mysql = require('../db');
var moment = require('moment');

var ignore = /^\/(public|agent)/;

exports.log2sql = function(req, res,next, msg){
	// Assets do not out log.
    if (ignore.test(req.url)) {
      next();
      return;
    }
	var email = '';
	if (req.session) {
		if(req.session.email){
			email = req.session.email;
		}
	}
	var access_date = moment().format('YYYY-MM-DD hh:mm:ss');
	var ip = req.ip || '';
	var hostname = req.hostname || '';
	var protocol = req.protocol || '';
	var url = req.url || '';
	var method = req.method || '';

	var req_header = JSON.stringify(req.headers) || '';

	var t = new Date();

	res.on('finish', function(data){
		var req_params = (method == 'POST' ? JSON.stringify(req.body) : JSON.stringify(req.query)) || '';
		var duration = new Date() - t;
		var res_header = res._header;

		// judge is normal send
		var status ='';

		if(msg.status){
			status = msg.status;
		}else {
			var head_arr = res_header.split(' ');
			status = head_arr[1];
		}
		var res_msg = '';
		if (typeof(msg) == 'object'){
			res_msg = JSON.stringify(msg);
		}

		var insert_log = 'INSERT INTO log_service (email, service_name, invoke_time, ip, req_header, res_header, duration, req_msg, res_msg, status) VALUES (?,?,?,?,?,?,?,?,?,?)';
		var params = [email, url, access_date, ip, req_header, res_header,duration, req_params, res_msg,status];
		console.log(params);
		mysql.query(insert_log, params, function(err, rows, fields){
			if (err) {
			   return next(err);
			}
			console.log('log success');
			return;
		})
	})
	next();
}
