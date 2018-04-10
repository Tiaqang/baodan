var mysql = require('./../db')
var eventproxy     = require('eventproxy')
var uuid           = require('node-uuid');
var validator      = require('validator');
// var User           = require('../proxy').User;
// var authMiddleWare = require('../../middlewares/auth');
var uuid           = require('node-uuid');
var moment = require('moment');
var log2_sql = require('../middlewares/getx_visit_sql');

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/index', // 获取国家名和产品信息，并显示在表单中
  '/saveInsurInfo',     // 将表单信息保存进数据库
];

exports.index = function (req, res, next) {
  var ep = new eventproxy();
	ep.fail(function(err){
 	   next(err)
 	   log2_sql.log2sql(req, res, next, err);
    });
    ep.on('prop_err', function (msg) {
      res.send(msg)
 	 log2_sql.log2sql(req, res, next, msg);
    });
// query nations from sb_location
var query_nation = 'SELECT * FROM sys_parameters WHERE param_type = "5"';
// query identity_type from user_details
// var query_certificate = 'SELECT * FROM certificate'
// query product from mutual_param
var query_product = 'SELECT * FROM mutual_param'

var mutual_param_id = req.query.program_id;

var lan = req.session.lan

var insurance=req.query.insurance;

mysql.query(query_nation, function(err, rows, fields){
    if (err) {
        next(err);
        return ep.emit('prop_err', {'status':'108','resMsg':'','errMsg': '服务器繁忙'});
    }
    var nation = rows;
    if (nation) {
        // mysql.query(query_certificate, function(err, rows2, fields2){
        //     if (err) {
        //         next(err);
        //         return ep.emit('prop_err', {'status':'26','resMsg':'','errMsg': '服务器繁忙'}'');
        //     }
        //     var certificate = rows2;
        //     if (certificate) {
                mysql.query(query_product, function(err, rows3, fields3){
                    if (err) {
                        next(err);
                        return ep.emit('prop_err',{'status':'109','resMsg':'','errMsg': '服务器繁忙'});
                    }
                    var product = rows3;
                    if (product) {
                        //接受参数 产品id 根据id 查询产品相关信息并传回页面


                        if(lan){
                          res.render('purchase/index_en',{
                            'name':'purchase',
                            'title':'purchase',
                            'nation': nation,
                            // 'certificate': certificate,
                            'product':product,
                            'program_id':mutual_param_id,
                            'insurance_id':insurance
                          });
                          return;
                        }
                        res.render('purchase/index',{
                        	'name':'purchase',
                          'title':'purchase',
                          'nation': nation,
                          // 'certificate': certificate,
                          'product':product,
                          'program_id':mutual_param_id,
                          'insurance_id':insurance
                        });
                        return;
                    }else {
                        return ep.emit('prop_err',{'status':'110','resMsg':'','errMsg': '服务器繁忙'});
                    }
                })
            // }else {
            //     return ep.emit('prop_err', {'status':'3','resMsg':'','errMsg': '服务器繁忙'});
            }
        })
    }
// 	else {
//         return ep.emit('prop_err', {'status':'111','resMsg':'','errMsg': '服务器繁忙'});
//     }
// })
//
// };


// save info
exports.saveInsurInfo = function(req, res, next){
    /*
{'program_id':program,'sex':sex,'relation':relation,
'nation':nation,'name':name,'email':email,'phone':phone,'birth':birth,'identity_n':identity_n}
    */


    var insurance_id = validator.trim(req.body.program_id);
    // var sex = req.body.sex; // 1:male, 2:female
    // var sex = validator.trim(req.body.sex); // 1:male, 2:female
    var sex = validator.trim(req.body.sex); // 1:male, 2:female
    var relationship = req.body.relation;
    var nation = validator.trim(req.body.nation); // nation id
    var name = validator.trim(req.body.name);
    var email = validator.trim(req.body.email);
    var phone      = validator.trim(req.body.phone);
    var birth    = validator.trim(req.body.birth);
    var identity_n    = validator.trim(req.body.identity_n); // identity_num
	  var mutual_id = validator.trim(req.body.program_id);

    var object_id = req.body.insurance_id; //获取保单id

    var status = 1; //待支付状态。

    var ep = new eventproxy();
    ep.fail(function(err){
 	   next(err)
 	   log2_sql.log2sql(req, res, next, err);
    });
    ep.on('prop_err', function (msg) {
      res.send(msg)
 	 log2_sql.log2sql(req, res, next, msg);
    });

    isValidInfo();
    ep.all( 'getUserId', 'getInsuranceID', function(user_id, insurance_id){
        var create_date = moment().format('YYYY-MM-DD hh:mm:ss');
        if(object_id){
          var sql = 'UPDATE mutual_insurance set user_id=?, mutual_id=?, relationship=?, name=?,sex=?, phone=?, birthday=?, identify_id=?,status=?,country=?,email=? where insurance_id =?';
          var params = [user_id, insurance_id ,relationship, name, sex, phone, birth,identity_n,status,nation,email,object_id];
        }else{
          var sql = 'INSERT INTO mutual_insurance (user_id, insurance_id, mutual_id, relationship, name,sex, phone, birthday, identify_id, create_time, status,country,email) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)';
          var params = [user_id, insurance_id ,mutual_id ,relationship,  name, sex, phone, birth,identity_n,create_date, status,nation,email];
        }

        mysql.query(sql, params, function(err, rows, fields){
          if (err) {
            next(err);
            return ep.emit('prop_err', {'status':'112','resMsg':'','errMsg': '服务器繁忙'}); // complete with next
          }
          return ep.emit('prop_err',  {'status':'0','resMsg':object_id?object_id:insurance_id,'errMsg': ''});
        })
    })
    getInsuranceID();
    // getIP();
    getUserId(req, res, next);
    // 验证信息的正确性
    function isValidInfo(){
        if ([insurance_id, mutual_id, sex, relationship, nation, name, birth, identity_n].some(
          function (item) {
            return item === '';
          }
        )) {
          return ep.emit('prop_err', {'status':'510','resMsg':'','errMsg': '请将信息填写完整'});
        }
        /*
        if (!validator.isEmail(email)) {
          return ep.emit('prop_err', {'status':'511','resMsg':'','errMsg': '邮箱不合法'});
        }
        */
    }

      function getInsuranceID(){
          var insurance_id = uuid.v1();
          var reg = /-/g;
		  var insurance_id = '2' + insurance_id.replace(reg,  '').substring(1,32); // guarantee slip start with number 2
          ep.emit('getInsuranceID', insurance_id );
      }
      function getIP(){
          var ip =  req.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
          req.connection.remoteAddress || // 判断 connection 的远程 IP
          req.socket.remoteAddress || // 判断后端的 socket 的 IP
          req.connection.socket.remoteAddress;
          ep.emit('getIP', ip);
      }
      function getUserId(req, res, next){
          var email = req.session.email;
          var queryId = 'SELECT register_id FROM user_register WHERE member=' + mysql.escape(email);
          mysql.query(queryId, function(err, rows, fields){
              if (err) {
                  next(err);
                  return ep.emit('prop_err', {'status':'113','resMsg':'','errMsg': '服务器繁忙'})
              }
              var user = rows[0]
              if (user) {
                  var register_id = user.register_id
                  if (register_id) {
					  return ep.emit('getUserId', register_id);
                  }
                  return ep.emit('prop_err',{'status':'405','resMsg':'','errMsg': '服务器繁忙,未查找到您的信息,请重新登录'});
              }else {
                  return ep.emit('prop_err', {'status':'406','resMsg':'','errMsg': '请先登录'})
              }
          })
      }
}

exports.getInsuranceInfo = function (req, res, next) {

  //根据保单id 查询保单信息
    var lan=req.session.lan


    //var insurance_id=req.query.insurance_id;

    var insurance_id = validator.trim(req.body.insurance_id);
    var insurance = 'SELECT * FROM mutual_insurance WHERE insurance_id=' + mysql.escape(insurance_id);


    mysql.query(insurance,function(err,rows,fields){

      var rescnt={}

      if(err){
        rescnt.status='113';
        rescnt.resMsg='';
        rescnt.errMsg=lan?'Server busy':'服务器繁忙';

      }else if(rows.length){
        rescnt.status='0';
        rescnt.resMsg=rows[0];
        rescnt.errMsg='';
      }

      res.send(JSON.stringify(rescnt));
    })


}
