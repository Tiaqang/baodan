var validator      = require('validator');
var eventproxy     = require('eventproxy');
//var config         = require('../config');
//var User           = require('../proxy').User;
//var mail           = require('../../common/mail');
//var tools          = require('../common/tools');
//var utility        = require('utility');
//var authMiddleWare = require('../middlewares/auth');
//var uuid           = require('node-uuid');
var mysql = require('../db');
//var svgCaptcha = require('svg-captcha');
//var moment = require('moment');

exports.index = function (req, res, next) {

var lan = req.session.lan;
var email= req.session.email;
var register_id = req.session.register_id;


	var ep =new eventproxy();
	ep.on('prop_err', function (msg) {
		console.log(msg)
	//res.send(msg)
	//log2_sql.log2sql(req, res, next, msg);
  });
//console.log(email)
	ep.all('data1_event', 'data2_event', function (data1, data2) {

		//var account_num=data1?data1.account_sum:0;
		var gave_num=data2&&data2.sum?data2.sum:0;
		if(lan){
			res.render('account/account_en',{
			  	'name':'personal',
			  	'title':'My account',
			  	'email':email,
			  	'account_num':data1,
			  	'gave_num':gave_num
		  	});
		  	return
		}
		res.render('account/account',{
			'name':'personal',
			'title':'我的账户',
			'email':email,
			'account_num':data1,
		  	'gave_num':gave_num
		});
	});


//查询账户优惠总额

	var query_balance = "SELECT * FROM discount_getx_log WHERE user_id="+mysql.escape(register_id);
	//console.log(query_balance)
    mysql.query(query_balance, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err',lan?'server busy':'服务器繁忙');
        }
        var preferential_num=0;
        if(rows&&rows.length){
        	rows.forEach(function(v,k){
        		if(v.status==2&&(v.dead_time==null||new Date(v.dead_time)>new Date())){
        			preferential_num+=v.unused_count;
        		}
        	})
        }
        console.log(11111111111,preferential_num)
        ep.emit('data1_event', preferential_num);

    })

//查询用户所有保单总额
    var query_balance = "SELECT sum(balance) as sum FROM mutual_insurance WHERE user_id="+mysql.escape(register_id);
    mysql.query(query_balance, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err',lan?'server busy':'服务器繁忙');
        }
        var query_balance = rows[0];
        //console.log(query_balance)

        ep.emit('data2_event', query_balance);

    })

}





exports.pay_record = function (req, res, next) {

var register_id = req.session.register_id;

var lan = req.session.lan
//查询该用户所有充值记录
var query_balance = "SELECT * FROM account_personalpay_record WHERE user_id="+mysql.escape(register_id);

mysql.query(query_balance,function(err,rows,fields){
	if (err) {
		console.log(err)
      	return;
    }
    var rescnt={};

    if(rows&&rows.length){
    	rescnt.status=1;
    	rescnt.data=rows;
    }else{
    	rescnt.status=2;//无记录
    }
    //console.log(rescnt)
    if(lan){
		res.render('account/pay_record_en',{
		  	'name':'personal',
		  	'title':'payRecord',
		  	'rescnt':rescnt
	  	});
		return
	}
	res.render('account/pay_record',{
		'name':'personal',
		'title':'充值记录',
		'rescnt':rescnt
	});

})

	
};


exports.preferential = function (req, res, next) {

	var lan = req.session.lan;

	var register_id = req.session.register_id;

	var query_balance = "SELECT * FROM discount_getx_log WHERE user_id="+mysql.escape(register_id);

	mysql.query(query_balance,function(err,rows,fields){

		var rescnt={};
		
		if(rows&&rows.length){
	    	rescnt.status=1;
	    	rescnt.data=rows;
	    }else{
	    	rescnt.status=2;//无记录
	    }


	    console.log(rescnt)
		if(lan){
			res.render('account/preferential_en',{
			  	'name':'personal',
			  	'title':'preferential',
			  	'rescnt':rescnt
		  	});
			return
		}
		res.render('account/preferential',{
			'name':'personal',
			'title':'优惠记录',
			'rescnt':rescnt
		});

	})
}

