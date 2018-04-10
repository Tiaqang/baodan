var validator      = require('validator');
var Eventproxy     = require('eventproxy');
var moment = require('moment');
var mysql = require('../../db');

exports.index = function (req, res, next) {


  var lan = req.session.lan
  //接收参数
  var mutual_insurance_id = req.query.insurance_id;

  //取session数据
  var register_id = req.session.register_id;
 // 查询未使用的GETX
 // var user_id = req.session.register_id;
 /* 1.根据保单ID查询产品ID
	 2.按照 产品ID查询优惠GETX(激活并且未过期，2有产品ID，3获取未使用的getx数量（unused_count))
	 select sum(unused_count) FROM discount_getx_log WHERE find_in_set(product_id, product_ids) AND status=2 AND curr_time BETWEEN effect_time AND dead_time ;
 */

 var curr_time = moment().format('YYYY-MM-DD hh:mm:ss');
 var ep = new Eventproxy();
 //支付页
 ep.on('getx_count', function(getx_count){
 	console.log('getx_count');
 	console.log(getx_count);
 	if(lan){
 	  res.render('pay/pay_en',{
 		'title':'pay',
 		'name':'personal',
 		'register_id':register_id,
 		'insurance_id':mutual_insurance_id,
 		'getx_count':getx_count
 	  });
 	  return
 	}
 	res.render('pay/pay',{
 	   'title':'支付',
 	   'name':'personal',
 	  'register_id':register_id,
 	   'insurance_id':mutual_insurance_id,
 	   'getx_count':getx_count
 	});
 })

 var queryProductID = 'SELECT mutual_id FROM mutual_insurance WHERE insurance_id="' +mutual_insurance_id + '"';

 mysql.query(queryProductID, function(err, rows, fields){
	 if (err) {
		 console.log('status: 10001');
	 	return next(err);
	 }
	 var insurance = rows[0];
	 if (insurance) {
		 	var product_id = insurance.mutual_id;
			var getGETX = 'select total_count, used_count FROM user_activity_log WHERE find_in_set("' + product_id +'", product_ids) AND user_id ="'+ register_id +'" AND "' + curr_time + '" BETWEEN effect_time AND dead_time';
			console.log('getGETX');
			console.log(getGETX);
			mysql.query(getGETX, function(err, rows, fields){
				if (err) {
					console.log('status: 10002');
					return next(err);
				}
				var account = rows[0]
				
				getx_count = account?account.total_count - account.used_count : 0 ;
				return ep.emit('getx_count', getx_count);
			})
		 }else {
		 	console.log('没有查询到该保单', mutual_insurance_id);
		 }
 });


};

/*
 * 支付成功后，更新保单
 */
exports.updateInsurance = function (req, res, next) {
  /*
   *  POST参数：
   *  userid:用户id
   *  insurance_id: 保单编号
   *  payment: {"getxself":"自有账户getx支付金额", "ethself":"自有账户eth支付金额", "ethgetx":"自有eht账户支付的eth对应getx金额",
                "getxpoint":"赠送的getx金额","getxtransactionHash":"自有getx交易hash",
                "ethtransactionHash":"自有eth交易hash", "ethtogetx":"eth与getx汇率"}
   */

  //接收参数
  var userid = req.body.user_id;
  var insurance_id = req.body.insurance_id;
  var payment = req.body.payment

  var create_date = moment().format('YYYY-MM-DD hh:mm:ss');

  console.log(userid+"-"+insurance_id+"-"+payment);
  //解析payment的json
  var payjson = JSON.parse(payment);

  var ep = new Eventproxy();
  ep.fail(next);

  ep.all('getxself_event', 'ethself_event', 'getxpoint_event', 'up_insrance_event', function (data1, data2, data3, data4) {
      // 在所有指定的事件触发后，将会被调用执行
      console.log(data1+'-'+data2+'-'+data3+'-'+data4);
      res.send({"status":"0","resMsg":""});

	  //
  });

  //若发生自有getx支付，记入支付消费流水表：account_personalpay_record
  if (typeof payjson.getxself != 'undefined') {
    console.log(1111);
    var insert_sql = 'INSERT INTO account_personalpay_record (user_id, pay_type, insurance_id, pay_account, pay_sum, create_date, block_num, block_transactionhash) VALUES(?,?,?,?,?,?,?,?)';

    var params = [userid, 1, insurance_id , 1,  payjson.getxself,create_date, 0, payjson.getxtransactionHash];
    console.log(params);
    mysql.query(insert_sql, params, function(err, rows, fields){
      if (err) {
        ep.emit('getxself_event', '-1');
        console.log(2222);
      } else {
        ep.emit('getxself_event',  '0');
        console.log(333);
      }
    })
  } else {
    ep.emit('getxself_event',  '0');
    console.log(444);
  }

  //若发生自有eth支付，记入支付消费流水表：account_personalpay_record
  if (typeof payjson.ethself != 'undefined') {
    //TODO:
    console.log("payjson.ethself:"+payjson.ethself);
    console.log(555);
  } else {
    ep.emit('ethself_event',  '0');
    console.log(666);
  }

  //若发生, 优惠账户支付，记入支付消费流水表：account_personalpay_record
  if (typeof payjson.getxpoint != 'undefined') {
    //TODO:
    console.log(777);
  } else {
    ep.emit('getxpoint_event',  '0');
    console.log(888);
  }

  //更新保单表: mutual_insurance, 根据insurance_id，变更status 为 已支付状态：2 。更新保费余额
  var money = 0;
  if (typeof payjson.getxself != 'undefined') {
    money = payjson.getxself;
  } else if (typeof payjson.getxpoint != 'undefined') {
    money = payjson.getxpoint;
  }

  var update_sql = 'update mutual_insurance set status=2, balance= balance + '+money+' where insurance_id=\''+insurance_id+'\'';
  console.log("update_sql:"+update_sql);
  mysql.query(update_sql, function(err, rows, fields){
    if (err) {
      console.log(999);
      ep.emit('up_insrance_event', '-1');
    } else {
      console.log(000);
      ep.emit('up_insrance_event',  '0');
    }
  })

  // 若存在transactionHash, 需异步去查询区块状态, 同步区块号到db
  // todo...

	/*
	1.获取用户ID
	2.根据用户ID获取邀请用户的random code
		若获取不到，
			return;
		3.根据邀请用户的random code获取邀请人的ID
		3.根据用户ID和邀请人ID，获取该流水表中的状态，
			状态为1：
				改为2,update时间，并且获取流水表中的product_ids, effect_time, dead_time,total_count,activity_id
			else：
				不做任何改变
	*/
	var invitee_id = req.session.register_id;
	var getCodeById = 'SELECT inviter_code FROM user_register WHERE register_id="' + invitee_id +'"';
	console.log('getCodeById');
	console.log(getCodeById);
	mysql.query(getCodeById, function(err, rows, fields){
		if (err) {
			console.log('status: 20001');
			return next(err);
		}
		var randomCode = rows[0];
		if (!randomCode) {
			return;
		}
		var getInviterIdByCode = 'SELECT register_id as inviter_id FROM user_register WHERE invite_code="' + randomCode.inviter_code + '"';
		console.log('getInviterIdByCode');
		console.log(getInviterIdByCode);
		mysql.query(getInviterIdByCode, function(err, rows, fields){
			if (err) {
				console.log('status: 20002');
				return next(err);
			}
			var inviter = rows[0];
			if (inviter) {
				var inviter_id = inviter.inviter_id;
				var queryByUserAndInvitee = 'SELECT * FROM discount_getx_log WHERE user_id="' +inviter_id +' " AND invitee_id="' + invitee_id + '"';
				console.log('queryByUserAndInvitee');
				console.log(queryByUserAndInvitee);
				mysql.query(queryByUserAndInvitee, function(err, rows, fields){
					if (err) {
						console.log('status: 20003');
						return next(err);
					}
					var userLog = rows[0];
					if (rows[0]) {
						var status = rows[0].status;
						if (status == 1) {
							var updateLog = 'UPDATE discount_getx_log SET status=2, update_time="' + create_date+'"';
							mysql.query(updateLog, function(err, rows, fields){
								if (err) {
									console.log('status: 20004');
									return next(err);
								}
								var product_ids = rows[0].product_ids;
								var effect_time = rows[0].effect_time;
								var dead_time = rows[0].dead_time;
								var total_count = rows[0].total_count;
								var activity_id = rows[0].activity_id;
								insertGETXPersonActi(inviter_id, product_ids,create_date,  effect_time, dead_time, total_count, activity_id);
							})
						}
					}
				})
			}
		})
	})

	// 将用户获得的getx写入个人-活动的总表
	function insertGETXPersonActi(user_id, product_ids,create_date,  effect_time, dead_time, total_count, activity_id){

		// 按照用户ID和活动ID查询该用户在该活动中拥有多少GETX
		var queryByUserAndActi = 'SELECT total_count FROM user_activity_log WHERE user_id="' + user_id + '" AND activity_id="' + activity_id + '"';
		var totalCount = total_count;
		mysql.query(queryByUserAndActi, function(err, rows, fields){
			if (err) {
				console.log('status: 10010');
				return next(err);
			}
			var userLog = rows[0];
			totalCount = userLog? userLog.total_count + total_count : total_count;
			var insertUserAndActi;
			var params_insertUserAndActi;

			if (userLog) {
				insertUserAndActi = 'UPDATE user_activity_log SET total_count=?, update_time=? WHERE user_id=? AND activity_id=?';
				params_insertUserAndActi = [totalCount, create_date, user_id,  activity_id];
			}else {
				insertUserAndActi = 'INSERT INTO user_activity_log(user_id, product_ids,create_time,  effect_time, dead_time, total_count, activity_id) VALUES(?,?,?,?,?,?,?)';
				params_insertUserAndActi = [user_id, product_ids,create_date,  effect_time, dead_time, totalCount, activity_id];
			}

			console.log('insertUserAndActi');
			console.log(insertUserAndActi);
			console.log(params_insertUserAndActi);
			mysql.query(insertUserAndActi, params_insertUserAndActi, function(err, rows, fields){
				if (err) {
					console.log('status: 20005');
					return next(err);
				}
				console.log('写入个人-活动的总表 成功');
			})
		})
	}
}
