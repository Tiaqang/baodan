var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
// var User           = require('../proxy').User;
var mail           = require('../common/mail');
var tools          = require('../common/tools');
var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid           = require('node-uuid');
var mysql = require('./../db');
var svgCaptcha = require('svg-captcha');

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
  '/getCode'  // 获取图片验证码
];

// check email code and send Email Code
exports.sendEmailCode = function(req, res, next){

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.send({result_msg:msg})
  });

  var email = validator.trim(req.body.email) || '';
  var session_randomCode = req.session.randomCode || '';
  var randomCode = validator.trim(req.body.code) || '';
  if (randomCode == session_randomCode) {
    // judge if email is or not existed
    var query_email = 'SELECT * FROM user WHERE email=' + mysql.escape(email);
    mysql.query(query_email, function(err, rows, fields){
      if (err) {
        return ep.emit('prop_err', '服务器繁忙');
      }
      var user = rows[0]
      if (user) {
        // user is existed
        return ep.emit('prop_err', '该邮箱已注册');
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
        return ep.emit('prop_err', 1);
      }
    })
  } else {
    // random code is false
    return ep.emit('prop_err', '验证码错误');
  }
}

// check picture code and send Email Code
exports.sendEmailCodeSetPass = function(req, res, next){

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.send({result_msg:msg})
  });

  var email = validator.trim(req.body.email) || '';
  var session_randomCode = req.session.randomCode;
  var randomCode = validator.trim(req.body.code) || '';
  if (randomCode == session_randomCode) {
    // judge if email is or not existed
    var query_email = 'SELECT * FROM user WHERE email=' + mysql.escape(email);
    mysql.query(query_email, function(err, rows, fields){
      if (err) {
        return ep.emit('prop_err', '服务器繁忙');
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
        return ep.emit('prop_err', 1);
      }else {
        return ep.emit('prop_err', '该邮箱未注册');
      }
    })
  } else {
    // random code is false
    return ep.emit('prop_err', '验证码错误');
  }
}

exports.signup = function (req, res, next) {

  var email = validator.trim(req.body.email);
  var emailCode = validator.trim(req.body.email_code);
  var pass      = validator.trim(req.body.password1);
  var rePass    = validator.trim(req.body.password2);


  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.send({result_msg:msg})
  });

  // 验证信息的正确性

  if ([emailCode, pass, rePass, email].some(
    function (item) {
      return item === '';
    }
  )) {
    return ep.emit('prop_err', '请将信息填写完整。');
  }
  if (pass.length < 5) {
    return ep.emit('prop_err', '密码不至少5个字符。');
  }

  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法。');
  }
  if (pass != rePass) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }
  // END 验证信息的正确性
  // judge email code is or not true
  var session_emailCode = validator.trim(req.session.session_emailCode);
  if (session_emailCode == emailCode) {
    var insert_sql = 'INSERT INTO user (email, password) VALUES(?,?)';
    var params = [email, utility.md5(pass)];
    mysql.query(insert_sql, params, function(err, rows, fields){
      if (err) {
        return ep.emit('prop_err', '服务器繁忙');
      }
      return ep.emit('prop_err', 1);
    })
  }else {
    return ep.emit('prop_err', '邮箱验证码错误');
  }

};

/**
 * Show user login page.
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 */

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
 exports.signin = function (req, res, next) {

   var ep = new eventproxy();
   ep.fail(next);
   ep.on('prop_err', function (msg) {
     res.send({result_msg:msg})
   });

   var code=req.body.code.toLowerCase();
   var email=req.body.email;
   var password=utility.md5(req.body.password);
   var seesion_code = req.session.randomCode;

   var result_msg = '';
   if (code != seesion_code) {
     return ep.emit('prop_err', '验证码错误');
   }else {
     var query = 'SELECT * FROM user WHERE email=' + mysql.escape(email);
     mysql.query(query,function(err, rows, fields){
       if (err) {
         return ep.emit('prop_err', '服务器繁忙');
       }
       var user = rows[0]
       if (user) {
         if (user.password == password) {
           return ep.emit('prop_err', user);
         }else {
           return ep.emit('prop_err', "密码错误");
         }
       } else {
         return ep.emit('prop_err', "该邮箱未注册");
       }
     });
   }
 };

// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect('/');
};

/**
 * reset password
 */

exports.resetPass = function (req, res, next) {
  var email   = validator.trim(req.body.email) || '';
  var pass = validator.trim(req.body.password1) || '';
  var repass   = validator.trim(req.body.password2) || '';
  var emailCode  = validator.trim(req.body.email_code) || '';
  var session_emailCode = validator.trim(req.session.session_emailCode);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.send({result_msg:msg})
  });

  // 验证信息的正确性
  if ([emailCode, pass, rePass, email].some(function (item) {
    return item === '';
  })) {
    ep.emit('prop_err', '请将信息填写完整');
    return;
  }
  if (pass.length < 5) {
    return ep.emit('prop_err', 0);
  }

  if (pass != repass) {
    return ep.emit('prop_err', '两次密码输入不一致');
  }
  if (emailCode != session_emailCode) {
    return ep.emit('prop_err', '密码不至少5个字符');
  }
  // query and judge if exited or not in database
  var query_user = 'SELECT * FROM user WHERE email=' + mysql.escape(email);
  mysql.query(query_user, function(err, rows, next){
    if (err) {
      return ep.emit('prop_err', '服务器繁忙');
    }
    var user = query_user[0]
    if (user) {
      var update_pass = 'UPDATE user SET password=' + utility.md5(mysql.escape(pass)) + 'WHERE email='+ mysql.escape(email);
      mysql.query(update_pass, function(err, rows, fields){
        if (err) {
          return  ep.emit('prop_err', '服务器繁忙');
        }
        return ep.emit('prop_err', 1);
      })
    }else {
      // do not exist
      return ep.emit('prop_err','该邮箱未注册')
    }
  })

};

// picture code
exports.getCode = (req, res) => {
    var codeConfig = {
        size: 4,// 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
        noise: 2, // 干扰线条的数量
        height: 44
    }
    var captcha = svgCaptcha.create(codeConfig);
    req.session.randomCode = captcha.text.toLowerCase(); //存session用于验证接口获取文字码
    console.log('session: ',req.session.randomCode);
    var codeData = {
        img:captcha.data
    }
    res.send(captcha.data);
}
