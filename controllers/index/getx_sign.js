var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../../config');
// var User           = require('../proxy').User;
var mail           = require('../../common/mail');
var tools          = require('../../common/tools');
var utility        = require('utility');
// var authMiddleWare = require('../../middlewares/auth');
var uuid           = require('node-uuid');
var mysql = require('../../db');
var svgCaptcha = require('svg-captcha');
var moment = require('moment');
var log2_sql = require('../../middlewares/getx_visit_sql')
var triggerActivity = require('../../common/triggerActivity')
/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/sendEmailCode', // 注册时发送邮箱验证码
  '/sendEmailCodeSetPass',     // 更改密码时发送邮箱验证码
  '/signup',         // 保存注册用户信息
  '/signin',      // 用户登录
  '/resetPass', // 更新密码
  '/signout',  // 用户登出
  '/islogin',  // 判断是否已登录
  '/modifyUserDetil', //更改用户信息
   '/queryUserDetil', //查询用户信息
  '/getCode',  // 获取图片验证码
  '/changeLan' //切换语言
];

// check email code and send Email Code
exports.sendEmailCode = function(req, res, next){


  var lan =req.session.lan;
  var ep = new eventproxy();
  ep.fail(function(err){
	  next(err)
	  log2_sql.log2sql(req, res, next, err);
  });
  ep.on('prop_err', function (msg) {
	res.send(msg)
	log2_sql.log2sql(req, res, next, msg);
  });

  var email = validator.trim(req.body.email) || '';
  var session_randomCode = req.session.randomCode.toLowerCase() || '';
  var randomCode = validator.trim(req.body.code).toLowerCase() || '';
  if (randomCode == session_randomCode) {
    // judge if email is or not existed
    var query_email = 'SELECT * FROM user_register WHERE member=' + mysql.escape(email);
    mysql.query(query_email, function(err, rows, fields){
      if (err) {
		  next(err);
        return ep.emit('prop_err', {'status':'101','resMsg':'','errMsg': lan?'Server busy':'服务器繁忙'});
      }
      var user = rows[0]
      if (user) {
        // user is existed
        return ep.emit('prop_err',  {'status':'405','resMsg':'','errMsg':lan?'Invalid email address':'该邮箱已注册'});
      }else {
        // send email code
        // send mail
        var randomNum="";
        for(var i=0;i<6;i++){
          randomNum += Math.floor(Math.random()*10);
        }
        // need to judge if failed
        mail.sendActiveMail(email, utility.md5(email  + config.session_secret), randomNum)
        // save in session
        req.session.session_emailCode = randomNum;
        return ep.emit('prop_err', {'status':'0','resMsg':lan?'Send success':'邮箱验证码发送成功','errMsg': ''});
      }
    })
  } else {
    // random code is false
    return ep.emit('prop_err', {'status':'301','resMsg':'','errMsg':lan?'code error':'验证码错误'});
  }
}

// check picture code and send Email Code
exports.sendEmailCodeSetPass = function(req, res, next){

  var lan = req.session.lan
  var ep = new eventproxy();
  ep.fail(function(err){
	  next(err)
	  log2_sql.log2sql(req, res, next, err);
  });
  ep.on('prop_err', function (msg) {
	res.send(msg)
	log2_sql.log2sql(req, res, next, msg);
  });

  var email = validator.trim(req.body.email) || '';
  var session_randomCode = req.session.randomCode;
  var randomCode = validator.trim(req.body.code) || '';
  if (randomCode == session_randomCode) {
    // judge if email is or not existed
    var query_email = 'SELECT * FROM user_register WHERE member=' + mysql.escape(email);
    mysql.query(query_email, function(err, rows, fields){
      if (err) {
		  next(err);
        return ep.emit('prop_err', {'status':'102','resMsg':'','errMsg': lan?'Server busy':'服务器繁忙'});
      }
      var user = rows[0]
      if (user) {
        // user is existed
        // send mail
        var randomNum="";
        for(var i=0;i<6;i++){
          randomNum += Math.floor(Math.random()*10);
        }
        // need to judge if failed
        mail.sendActiveMail(email, utility.md5(email  + config.session_secret), randomNum)
        // save in session
        req.session.session_emailCode = randomNum;
        return ep.emit('prop_err', {'status':'0','resMsg':'','errMsg': ''});
      }else {
        return ep.emit('prop_err', {'status':'401','resMsg':'','errMsg': lan?'Invalid email address':'该邮箱未注册'});
      }
    })
  } else {
    // random code is false
    return ep.emit('prop_err',{'status':'302','resMsg':'','errMsg':lan?'code error':'验证码错误'});
  }
}

exports.signup = function (req, res, next) {

  var lan=req.session.lan;
  var email = validator.trim(req.body.email);
  var emailCode = validator.trim(req.body.email_code);
  var pass      = validator.trim(req.body.password1);
  var rePass    = validator.trim(req.body.password2);
	var inviter_code = validator.trim(req.body.invite_code) || '';
    var ep = new eventproxy();
	ep.fail(function(err){
 	   next(err)
 	   log2_sql.log2sql(req, res, next, err);
    });
    ep.on('prop_err', function (msg) {
      res.send(msg)
 	  log2_sql.log2sql(req, res, next, msg);
    });
    isValid();

    ep.all('invitCode', 'getUserID', function(invite_code, register_id){
            var create_date = moment().format('YYYY-MM-DD hh:mm:ss');
            var insert_sql = 'INSERT INTO user_register (register_id, member, passwd, create_date, invite_code, inviter_code) VALUES(?,?,?,?,?,?)';
            var params = [register_id, email, utility.md5(pass),create_date, invite_code, inviter_code];
            mysql.query(insert_sql, params, function(err, rows, fields){
              if (err) {
                next(err);
                return ep.emit('prop_err',{'status':'103','resMsg':'','errMsg':lan?'Server busy':'服务器繁忙'});
              }
			  triggerActivity.registActivity(req, res, next, register_id);
			  if (inviter_code !='') {
			  		triggerActivity.inviteActivity(req, res, next, register_id, inviter_code);
			  }


			  // 触发活动
			  /*
			  if (config.triggerActivity && inviter_code) {
				  // query register_id by inviter_code
				  var queryRegisterIdByInviteCode = 'SELECT register_id FROM user_register WHERE invite_code=' + mysql.escape(inviter_code);
				  mysql.query(queryRegisterIdByInviteCode, function(err, rows, fields){
					  if (err) {
					  	next(err);
						return ep.emit('prop_err', {'status':'115','resMsg':'','errMsg': '服务器繁忙'});
					  }
					  var re_id = rows[0]
					  if (re_id && re_id.register_id) {
						  console.log('register_id', re_id.register_id);
					  	 triggerActivity.registActivity(req, res, next, register_id, re_id.register_id);
					 }
				  })

			  }*/

              return ep.emit('prop_err', {'status':'0','resMsg':lan?'Success':'注册成功','errMsg': ''});
            })
        })

		invitCode(6);
	    getIP();
	    getUserID();
    // 验证信息的正确性
    function isValid(){

        if ([emailCode, pass, rePass, email].some(
          function (item) {
            return item === '';
          }
        )) {
          return ep.emit('prop_err',{'status':'501','resMsg':'','errMsg': '请将信息填写完整'} );
        }
        if (pass.length < 5) {
          return ep.emit('prop_err',{'status':'502','resMsg':'','errMsg': '密码不至少5个字符'});
        }

        if (!validator.isEmail(email)) {
          return ep.emit('prop_err',{'status':'503','resMsg':'','errMsg': '邮箱不合法'});
        }
        if (pass != rePass) {
          return ep.emit('prop_err',{'status':'504','resMsg':'','errMsg': '两次密码输入不一致'});
        }
        // END 验证信息的正确性
        // judge email code is or not true
        var session_emailCode = validator.trim(req.session.session_emailCode);
        if (session_emailCode != emailCode) {
              return ep.emit('prop_err', {'status':'303','resMsg':'','errMsg': '邮箱验证码错误'});
          }
          ep.emit('isValid');
      }


    function getIP(){
        var ip =  req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
        req.connection.remoteAddress || // 判断 connection 的远程 IP
        req.socket.remoteAddress || // 判断后端的 socket 的 IP
        req.connection.socket.remoteAddress;
        ep.emit('getIP', ip);
    }
    function invitCode(n) {
      var items = [
          "0", "1", "2",  "6",
          "A", "B", "C", "D",
          "3", "4", "5",
          "H", "I", "J", "K",
          "L", "M", "N",
          "O", "P", "Q",
          "7", "8", "9",
          "R", "S", "T",
          "U", "V", "W",
          "E", "F", "G",
          "X", "Y", "Z"
      ]
      var invite_code="";
      for(var i=0; i<n; i++) {
        var id = Math.ceil(Math.random()*35);
        invite_code += items[id];
	}
      // judge if existed
      var queryCode = 'SELECT invite_code FROM user_register WHERE invite_code="'+ invite_code +'"';
      mysql.query(queryCode, function(err,rows, fields){
          if (err) {
              next(err);
              return ep.emit('prop_err',  {'status':'104','resMsg':'','errMsg': '服务器繁忙'});
          }
          // var codeArr = rows.invite_code;
		  if (rows[0]) {
			  invitCode(6);
			  return;
		  }
          ep.emit('invitCode',invite_code);
      })
  }
      function getUserID(){
          var random_id = uuid.v1();
          var reg = /-/g;
          var register_id = '1' + random_id.replace(reg,  '').substring(1,32); // guarantee slip start with number 1
          ep.emit('getUserID', register_id);
      }
};
/**
signin
*/
 exports.signin = function (req, res, next) {
    var lan =req.session.lan;
   var ep = new eventproxy();
   ep.fail(function(err){
	   next(err)
	   log2_sql.log2sql(req, res, next, err);
   });
   ep.on('prop_err', function (msg) {
     res.send(msg)
	 log2_sql.log2sql(req, res, next, msg);
   });

   var code = validator.trim(req.body.code).toLowerCase();
   var email=validator.trim(req.body.email);
   var password=utility.md5( validator.trim(req.body.password));
   var seesion_code = req.session.randomCode;

   if (code != seesion_code) {
     return ep.emit('prop_err', {'status':'304','resMsg':'','errMsg':lan?'code error':'验证码错误'});
   }else {
     var query = 'SELECT * FROM user_register WHERE member=' + mysql.escape(email);
     mysql.query(query,function(err, rows, fields){
       if (err) {
         return ep.emit('prop_err',{'status':'105','resMsg':'','errMsg':lan?'server busy':'服务器繁忙'});
       }
       var user = rows[0]
       if (user) {
         if (user.passwd == password) {
             // save email to session
             req.session.email = email;
             req.session.register_id = user.register_id;

           	return ep.emit('prop_err', {'status':'0','resMsg':user,'errMsg': ''});
         }else {
           return ep.emit('prop_err', {'status':'402','resMsg':'','errMsg':lan?'password error':'密码错误'});
         }
       } else {
         return ep.emit('prop_err', {'status':'403','resMsg':'','errMsg':lan? 'invalid email address':'该邮箱未注册'});
       }
     });
   }
 };

// modify user info
exports.modifyUserDetil = function (req, res, next) {
  var lan =req.session.lan;
	var ep = new eventproxy();
    ep.fail(function(err){
  	  next(err)
  	  log2_sql.log2sql(req, res, next, err);
    });
    ep.on('prop_err', function (msg) {
  	res.send(msg)
  	log2_sql.log2sql(req, res, next, msg);
    });
	var register_id = req.session.register_id; // uuid
	var college=validator.trim(req.body.graduation) || ''; // college
	//var edu_level=validator.trim(req.body.education) || ''; // education level
	var profession=validator.trim(req.body.job) || '';//从事职业
	// var income=validator.trim(req.body.earn) || '';
	var marital_status=validator.trim(req.body.marry) || '';//婚姻状况
	// var fertility_status=validator.trim(req.body.fertility_status) || '';
	var phone =validator.trim(req.body.phone) || '';//电话号码
	var birthday =req.body.birthday || '';//出生年月
	var sex = validator.trim(req.body.sex);//性别
    var address = validator.trim(req.body.address);//地址

	var modify_sql = 'UPDATE user_register SET college=?, profession=?, marital_status=?, phone=?, birthday=?, sex=?, address=? WHERE register_id=' + mysql.escape(register_id);
	var params = [college, profession, marital_status, phone, birthday, sex, address]
	mysql.query(modify_sql, params, function(err, rows, fields){
		if (err) {
			next(err);
			return ep.emit('prop_err', {'status':'111','resMsg':'','errMsg':lan?'server busy':'服务器繁忙'});
		}
		return ep.emit('prop_err', {'status':'0','resMsg':lan?'success':'修改成功','errMsg': ''});
	})

};

// query user info
exports.queryUserDetil = function(req, res, next){
  var lan =req.session.lan
	var ep = new eventproxy();
    ep.fail(function(err){
  	  next(err)
  	  log2_sql.log2sql(req, res, next, err);
    });
    ep.on('prop_err', function (msg) {
  	res.send(msg)
  		log2_sql.log2sql(req, res, next, msg);
    });
	var register_id = req.session.register_id;
	var modify_sql = 'SELECT * FROM user_register WHERE register_id=' + mysql.escape(register_id);
	mysql.query(modify_sql, function(err, rows, fields){
		if (err) {
			next(err);
			return ep.emit('prop_err', {'status':'114','resMsg':'','errMsg':lan? 'server busy':'服务器繁忙'});
		}
		var user = rows[0];
		if (user) {
			return ep.emit('prop_err', {'status':'0','resMsg':user,'errMsg':''});
		}
		return ep.emit('prop_err', {'status':'406','resMsg':'','errMsg':lan?'please re-login':'请重新登录'});
	})
}
// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  // res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.send({'status':'0','resMsg':'','errMsg': ''});
};

/**
 * reset password
 */

exports.resetPass = function (req, res, next) {
  var lan = req.session.lan;
  var email   = validator.trim(req.body.email) || '';
  var pass = validator.trim(req.body.password1) || '';
  var rePass   = validator.trim(req.body.password2) || '';
  var emailCode  = validator.trim(req.body.email_code) || '';
  var session_emailCode = validator.trim(req.session.session_emailCode);

  var ep = new eventproxy();
  ep.fail(function(err){
	  next(err)
	  log2_sql.log2sql(req, res, next, err);
  });
  ep.on('prop_err', function (msg) {
	res.send(msg)
	log2_sql.log2sql(req, res, next, msg);
  });

  // 验证信息的正确性
  if ([emailCode, pass, rePass, email].some(function (item) {
    return item === '';
  })) {
    ep.emit('prop_err', {'status':'505','resMsg':'','errMsg': lan?'please fill all info':'请将信息填写完整'});
    return;
  }
  if (pass.length < 5) {
    return ep.emit('prop_err', {'status':'506','resMsg':'','errMsg':lan?'password should not less than 5 letters':'密码不至少5个字符'});
  }

  if (pass != rePass) {
    return ep.emit('prop_err',  {'status':'507','resMsg':'','errMsg':lan?'password is not consistent':'两次密码输入不一致'});
  }
  if (emailCode != session_emailCode) {
    return ep.emit('prop_err', {'status':'305','resMsg':'','errMsg': lan?'email code error':'邮箱验证码错误'});
  }
  // query and judge if exited or not in database
  var query_user = 'SELECT * FROM user_register WHERE member=' + mysql.escape(email);
  mysql.query(query_user, function(err, rows, next){
    if (err) {
      next(err)
      return ep.emit('prop_err', {'status':'106','resMsg':'','errMsg':lan?'server error':'服务器繁忙'});
    }
    var user = query_user[0]
    if (user) {
      var update_pass = 'UPDATE user_register SET passwd="' + utility.md5(pass) + '"  WHERE member='+ mysql.escape(email);
      mysql.query(update_pass, function(err, rows, fields){
        if (err) {
          return  ep.emit('prop_err',{'status':'107','resMsg':'','errMsg':lan? 'server busy':'服务器繁忙'});
        }
        return ep.emit('prop_err', {'status':'0','resMsg':lan?'success':'修改密码成功','errMsg': ''});
      })
    }else {
      // do not exist
      return ep.emit('prop_err', {'status':'404','resMsg':'','errMsg':lan? 'invalid email address':'该邮箱未注册'})
    }
  })

};

// picture code
exports.getCode = (req, res) => {

    //随机生产字符串
    var codeLen=4;
    var text='qwertyuiopasdfghjklzxcvbnm1234567890';

    var code=createCode(text,codeLen);

    req.session.randomCode = code.toLowerCase(); //存session用于验证接口获取文字码

    res.send(code)


    function createCode(text,codeLen){
      var str='';
      for(var i=0;i<codeLen;i++){
          var index=randomNum(0,text.length)

          if(index>text.length/2){
            str+=text[index].toUpperCase();
          }else{
            str+=text[index]
          }
      }
      return str

    }
    function randomNum(min,max){
      return Math.floor( Math.random()*(max-min)+min);
    }




    /*var codeConfig = {
        fontSize:26,
        size: 4,// 验证码长度
        ignoreChars: 'O0o1LlIi', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        width:100,
        height:40
    }
    var captcha = svgCaptcha.create(codeConfig);
    req.session.randomCode = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    console.log('piccture code: ',req.session.randomCode);
    var codeData = {
        img:captcha.data
    }
    res.send(captcha.data);*/
}

exports.islogin = function(req,res){
  console.log(req.session.register_id);
  if(req.session.register_id){
    res.json({
      'stage':req.session.email
    })
  }else{
    res.json({
      'stage':0
    })
  }
}


/**
 * change lan
 */

 exports.changeLan = function(req,res,next){
  //判断session中有无lan
  //lan?en:ch
  var lan=req.session.lan

  req.session.lan=lan?0:1;
  res.send({'status':'0','resMsg':'','errMsg': ''})

}
