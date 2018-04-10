var mysql = require('../db')
var svgCaptcha = require('svg-captcha');
var async = require('async');
var utility        = require('utility');
//var domain_middle = require('./../common/domain_middle.js')
//var domain = require('domain');

exports.index = function (req, res, next) {

  res.render('test/index',{
  	'name':'test',
  });
};

exports.signin = function (req, res, next) {
  var code=req.body.code.toLowerCase();
  var email=req.body.email;
  var password=utility.md5(req.body.password);
  var seesion_code = req.session.randomCode;

  // // domain_middle(req, res, next);
  // var d = domain.create();
  // //监听domain的错误事件
  // d.on('error', function (err) {
  //   logger.error(err);
  //   res.statusCode = 500;
  //   res.json({sucess:false, messag: '服务器异常'});
  //   d.dispose();
  // });
  //
  // d.add(req);
  // d.add(res);
  // d.run(next);

  var result_msg = '';
  if (code !== seesion_code) {
    result_msg = {result:"验证码错误"};
    res.json(result_msg);
  }else {
    var query = 'SELECT * FROM user WHERE email=' + mysql.escape(email);
    mysql.query(query,function(err, rows, fields){
      var user = rows[0]
      if (user) {
        if (user.password == password) {
          result_msg = {"result": user};
        }else {
          result_msg = {"result": "密码错误"};
        }
      } else {
        result_msg = {result: "邮箱错误"}
      }
      res.json(result_msg);
    });

  }

  // res.render('test/test_signin',{
  // 	'name':'test_signin',
  // });
};

exports.test_sql = function(req, res, next){
  var query = "SELECT * FROM user WHERE name='david' OR email ='quant@chinaelite.hk'";
  console.log(query);
  mysql.query(query, function(err, rows, fields){
    console.log(11111111);
    if (err) {
      return next(err);
    }
    console.log(rows);
    res.render('test/index',{
      'name':rows,
    })
  })
}

exports.getCode = (req, res) => {
    var codeConfig = {
        size: 5,// 验证码长度
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
exports.getRandomNum = (req, res) => {
  var randomNum="";
  for(var i=0;i<6;i++){
    randomNum += Math.floor(Math.random()*10);
  }
  req.session.randomNum = randomNum;
  return randomNum;
}
