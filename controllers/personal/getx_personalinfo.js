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
//我的保障
exports.getPersonalAllGuards = function (req, res, next) {

var lan = req.session.lan
// var userid = '123';
var register_id = req.session.register_id +'';
  var query_email = 'SELECT a.name,a.status,ifnull(a.getx_balance,0)+ifnull(a.discount_getx_balance,0)+ifnull(a.points_balance,0) as balance,a.insurance_id,b.mutual_name, b.insure_money FROM mutual_insurance a,mutual_param b WHERE a.mutual_id = b.mutual_id and a.user_id="'+ register_id +'"';
    mysql.query(query_email, function(err, rows, fields){
      if (err) {
        return ep.emit('prop_err', '服务器繁忙');
      }
      var mutual_list = rows;

      if(lan){
        res.render('getPersonalAllGuards/getPersonalAllGuards_en',{
            'name':'personal',
            'title':'My protection',
            'data':mutual_list
        });
        return
      }
      res.render('getPersonalAllGuards/getPersonalAllGuards',{
          'name':'personal',
          'title':'我的保障',
          'data':mutual_list
      });
    })

};

//个人中心
exports.index = function (req, res, next) {

    // var userid = '123';
    var register_id = req.session.register_id +'';
    var lan= req.session.lan
    var ep = new eventproxy();

    ep.all('data1_event', 'data2_event', function (data1, data2) {
      var data = {};
      data.info = data2;
      data.money = data1;
      console.log(data);

      if(!data.info){
        if(lan){
          res.render('home_en',{
             'name':'home',
               'title':'home'
               //'rows':rows,
           });
        }
        res.render('home',{
         'name':'home',
          'title':'home'
           //'rows':rows,
        });
        return;
      }
      if(lan){
        res.render('information/index_en',{
            'name':'personal',
            'title':'Account summary',
            'data':data
        });
        return
      }
      res.render('information/index',{
          'name':'personal',
          'title':'个人中心',
          'data':data
      });
      return;
    });

    var query_balance = "SELECT SUM(a.getx_balance)+sum(a.discount_getx_balance)+sum(a.points_balance) as total_balance,SUM(b.insure_money) as total_money FROM mutual_insurance a,mutual_param b WHERE a.mutual_id = b.mutual_id AND a.user_id = '"+ register_id +"';";
    mysql.query(query_balance, function(err, rows, fields){
        //console.log(query_balance);
        if (err) {
          console.log(err);
          return ep.emit('prop_err',lan?'server busy':'服务器繁忙');
        }
        var query_balance = rows[0];

        console.log(12313123313,query_balance);

        ep.emit('data1_event', query_balance);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })

    register_id = req.session.register_id +'';

    var query_info = "SELECT name,member,phone,invite_code,country FROM user_register WHERE register_id='"+ register_id +"'";

    mysql.query(query_info, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', lan?'server busy':'服务器繁忙');
        }
        var query_info = rows[0];

        //console.log(query_info);

        ep.emit('data2_event', query_info);

    })




};

//修改个人信息
exports.modifyPersonalInfo = function (req, res, next) {

  var lan = req.session.lan

  if(lan){
    res.render('information/modifyPersonalInfo_en', {
        'name': 'modifyPersonalInfo',
        'title':'Complete personalInfo'
    })
    return
  }

  res.render('information/modifyPersonalInfo', {
      'name': 'modifyPersonalInfo',
      'title':'修改个人信息'
  })
};

//获取保单详情
exports.getPersonalGuard = function (req, res, next) {

    var id = req.params.id;
    var lan =req.session.lan

    
    
    var ep = new eventproxy();

    ep.all('get_info', 'get_country','get_relation','get_status','get_sex','get_block','status_day', function (data1, data2,data3,data4,data5,data6,data7) {
      var data = {};
      data.info = data1;
      data.country = data2;
      // data.mutual_id = data3;
      data.relation = data3;
      data.status = data4;
      data.sex = data5;
      data.block = data6;
      data.status_day=data7;
      console.log(data);

      if(lan){
        res.render('mutual_details/mutual_details_en',{
            'name':'personal',
            'title':'Mutual details',
            'data':data
        });
        return
      }
      res.render('mutual_details/mutual_details',{
          'name':'personal',
          'title':'互助详情',
          'data':data
      });
      return;
    });
    //获取个人信息
     var get_info = "SELECT insurance_id,name,identify_id,birthday,phone,create_time,ifnull(getx_balance,0)+ifnull(discount_getx_balance,0)+ifnull(points_balance,0) as balance,email,sex,status FROM mutual_insurance WHERE insurance_id='"+id+"'";
    mysql.query(get_info, function(err, rows, fields){
        console.log(get_info);
        if (err) {
          console.log(err);
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_info = rows[0];
        console.log(get_info);
        get_info.create_time = moment(get_info.create_time).format("YYYY-MM-DD")
        console.log(get_info);

        ep.emit('get_info', get_info);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })
    //获取国家
    var get_country = "SELECT b.name FROM mutual_insurance a, sys_parameters b WHERE a.insurance_id='"+id+"' AND a.country = b.param_value AND b.param_type='5'";
    mysql.query(get_country, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_country = rows[0];

        console.log(get_country);

        ep.emit('get_country', get_country);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    });
    //获取与受助人关系
    var get_relation = "SELECT b.name FROM mutual_insurance a, sys_parameters b WHERE a.insurance_id='"+id+"' AND a.relationship = b.param_value AND b.param_type='7'";
    mysql.query(get_relation, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_relation = rows[0];

        console.log(get_relation);

        ep.emit('get_relation', get_relation);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })
    //获取互助状态期
    var get_status = "SELECT b.name FROM mutual_insurance a, sys_parameters b WHERE a.insurance_id='"+id+"' AND a.status = b.param_value AND b.param_type='3'";
    mysql.query(get_status, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_status = rows[0];

        console.log(get_status);

        ep.emit('get_status', get_status);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })
    //获取性别
    var get_sex = "SELECT b.name FROM mutual_insurance a, sys_parameters b WHERE a.insurance_id='"+id+"' AND a.sex = b.param_value AND b.param_type='4'";
    mysql.query(get_sex, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_sex = rows[0];

        console.log(get_sex);

        ep.emit('get_sex', get_sex);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })
    //获取区块详情
    var get_block = "SELECT pay_type,block_num,block_transactionhash FROM account_personalpay_record WHERE insurance_id = '"+id+"'";
    mysql.query(get_block, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var get_block = rows;

        console.log(get_block,'232');

        ep.emit('get_block', get_block);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })
    //获取状态期天数
    var status_day = "SELECT b.proof_day,b.delay_day,b.mutual_name FROM mutual_insurance a,mutual_param b WHERE a.insurance_id = '"+id+"' and b.mutual_id = a.mutual_id";
    mysql.query(status_day, function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }

        var status_day = rows[0];

        console.log(status_day);

        ep.emit('status_day', status_day);

        //接受参数 产品id 根据id 查询产品相关信息并传回页面
    })



};
//申请互助
exports.applyGuard = function (req, res, next) {
    var lan =req.session.lan

    if(lan){
      res.render('applyGuard/applyGuard_en',{
          'name':'personal',
          'title':'applyGuard',
      });
      return
    }
    res.render('applyGuard/applyGuard',{
        'name':'personal',
        'title':'申请互助',
    });

    

    
};

//退出保障页面初始数据获取
exports.quitGuard = function (req, res, next) {
    var id = req.params.id;
    var user_id = req.session.register_id;
    var lan =req.session.lan;
    console.log(id);

    var ep = new eventproxy();
    
    ep.all( 'mutual_name', 'quit_info', function(mutual_name, quit_info){
        
        console.log(mutual_name,quit_info,'33333333');

        if(lan){
          res.render('quitGuard/quitGuard_en',{
              'name':'personal',
              'title':'quitGuard',
              'insurance_id':id,
              'mutual_name':mutual_name.ename,
              'quit_info':quit_info
          });
          return
        }

        res.render('quitGuard/quitGuard',{
            'name':'personal',
            'title':'退出计划',
            'insurance_id':id,
            'mutual_name':mutual_name.name,
            'quit_info':quit_info
        });
    })

    var mutual_name='SELECT a.name,a.ename FROM sys_parameters a,mutual_insurance b WHERE insurance_id = "'+ id +'" AND a.param_value = b.mutual_id AND param_type = 6 ';
    console.log(mutual_name);
    mysql.query(mutual_name,function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var mutual_name = rows[0];
        // console.log(rows[0]);

        ep.emit('mutual_name',mutual_name)

    });

    var quit_stage='SELECT stage FROM mutual_withdraw WHERE insurance_id = "'+ id +'"';
    console.log(quit_stage);
    mysql.query(quit_stage,function(err, rows, fields){
        if (err) {
          return ep.emit('prop_err', '服务器繁忙');
        }
        var quit_info = rows[0];
        // console.log(rows[0],1111);

        ep.emit('quit_info',quit_info)

    })

    
};

//接收申请退出信息
exports.quit_info = function (req, res, next) {

    var eth_address = validator.trim(req.body.eth_address); // 1:male, 2:female
    var quit_reason = validator.trim(req.body.quit_reason); // nation id
    var insurance_id = validator.trim(req.body.insurance_id);
    var register_id = req.session.register_id;


    var lan =req.session.lan;
    console.log(eth_address,quit_reason,insurance_id);

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

    ep.all('submit_info',function(get_info){

       res.json(get_info)
    })
     var create_date = moment().format('YYYY-MM-DD hh:mm:ss');
     /**stage：审核状态期；1：正在进行人工审核中
     2：已通过人工审核，系统准备返还GETX，1-3个工作日完成
     3：已完成退出
     **/
    var submit_info = 'INSERT INTO mutual_withdraw (register_id,insurance_id,quit_reason,eth_address,stage,quit_money,create_date) VALUES(?,?,?,?,?,?,?)';
    var params = [register_id,insurance_id,mysql.escape(quit_reason),mysql.escape(eth_address),1,0,create_date];
    mysql.query(submit_info, params, function(err, rows, fields){
        if (err) {
          next(err);
          return ep.emit('prop_err',{'status':'103','resMsg':'','errMsg': '服务器繁忙'});
        }
        return ep.emit('submit_info', {'status':'0','resMsg':'提交成功！','errMsg': ''});
      })
    // 验证信息的正确性
    function isValidInfo(){
        if ([eth_address, quit_reason].some(
          function (item) {
            return item === '';
          }
        )) {
          return ep.emit('prop_err', {'status':'510','resMsg':'','errMsg': '请将信息填写完整'});
        }
    }

    
    

};
