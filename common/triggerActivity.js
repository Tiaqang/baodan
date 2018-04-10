var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
// var User           = require('../proxy').User;
// var mail           = require('../../common/mail');
// var tools          = require('../../common/tools');
// var utility        = require('utility');
// var authMiddleWare = require('../../middlewares/auth');
// var uuid           = require('node-uuid');
var mysql = require('../db');
// var svgCaptcha = require('svg-captcha');
var moment = require('moment');
var log2_sql = require('../middlewares/getx_visit_sql')


exports.inviteActivity = function(req, res, next , invitee_id, inviter_code){
	// define activity_id  of regist is 'aaa' and account_type is 1;
	var activity_id = 'aaa';

	var curr_time = moment().format('YYYY-MM-DD hh:mm:ss');

	var ep = new eventproxy();
	ep.fail(function(err){
		 next(err)
		 log2_sql.log2sql(req, res, next, err);
	});
	ep.on('queryActivity', function (activityInfo) {
		   queryUser(inviter_code, activityInfo, invitee_id)
	});
	queryActivity(activity_id)

	// 根据邀请码获取邀请人信息
	function queryUser(inviter_code, activityInfo, invitee_id){
		console.log('activityInfo', activityInfo);
		var queryRegisterIdByInviteCode = 'SELECT register_id FROM user_register WHERE invite_code=' + mysql.escape(inviter_code);
		console.log('queryRegisterIdByInviteCode');
		console.log(queryRegisterIdByInviteCode);
		mysql.query(queryRegisterIdByInviteCode, function(err, rows, fields){
			if (err) {
				  console.log('status: 1001');
				  return next(err);
				  // return ep.emit('prop_err', {'status':'115','resMsg':'','errMsg': '服务器繁忙'});
			}
			var inviter = rows[0]
			console.log('根据邀请码获取邀请人id');
			console.log(inviter);
			if (inviter) {
				// 获取活动的信息
				var single_limit = activityInfo.single_limit;
				var sent_reward = activityInfo.sent_reward;
				var single_reward = activityInfo.single_reward;
				var product_ids = activityInfo.product_ids || '*';
				var effect_time = activityInfo.effect_time || '';
				var dead_time = activityInfo.dead_time || '';
				var total_count = activityInfo.single_reward || '';
				console.log('effect_time ', effect_time);
			   var inviter_id = inviter.register_id;

				   // 查询该用户获得该活动的总数量
				   var queryUserReward = 'SELECT sum(total_count) as total_counts FROM discount_getx_log WHERE user_id="' + inviter_id + '" AND activity_id="' + activity_id + '"';
				   console.log('queryUserReward');
				   console.log(queryUserReward);
				   mysql.query(queryUserReward, function(err, rows, fields){
					   if (err) {
					   		console.log('status: 1007');
							next(err);
					   }
					   var user = rows[0];
					   console.log(rows);
					   console.log(rows);
					   console.log(typeof(user));
					   if (!user || user.total_counts < single_limit) {
						   insertGETXDiscountLog(inviter_id, product_ids,curr_time,  effect_time, dead_time, total_count, invitee_id, activity_id);
						   ep.on('insertGETXDiscountLog', function(){
				   				upActivityAccount(activity_id, sent_reward, single_reward);
								// 等邀请者购买后再激活
								// insertGETXPersonActi(inviter_id, product_ids,curr_time,  effect_time, dead_time, total_count, activity_id);
						   })
					   }

				   })
		   }else {
		   		console.log('未查询到邀请人的信息');
		   }
	   })
	}

	// 将用户获得的GETX记录到discount_getx_log
	function insertGETXDiscountLog(user_id, product_ids,create_date,  effect_time, dead_time, total_count, invitee_id, activity_id){
		var insertGETXDiscountLog;
		var params_insertGETXDiscountLog;
		if (effect_time && dead_time ) {
			insertGETXDiscountLog = 'INSERT INTO discount_getx_log(user_id, product_ids,create_time,  effect_time, dead_time, total_count,  invitee_id, activity_id) VALUES(?,?,?,?,?,?,?,?)';
			params_insertGETXDiscountLog = [user_id, product_ids,create_date,  effect_time, dead_time, total_count,  invitee_id, activity_id];
		}else {
			insertGETXDiscountLog = 'INSERT INTO discount_getx_log(user_id, product_ids,create_time, total_count,  invitee_id, activity_id) VALUES(?,?,?,?,?,?)';
			params_insertGETXDiscountLog = [user_id, product_ids,create_date, total_count, invitee_id, activity_id];
		}

		console.log('insertGETXDiscountLog');
		console.log(insertGETXDiscountLog);
		console.log(params_insertGETXDiscountLog);
		mysql.query(insertGETXDiscountLog, params_insertGETXDiscountLog, function(err, rows, fields){
			if (err) {
				console.log('status: 1009');
				return next(err);
			}
			ep.emit('insertGETXDiscountLog')
			console.log('写入用户获得优惠的记录 成功');
		})
	}


	// 根据活动ID获取活动等信息  判断完成并且通过后返回单人获得优惠的数量,单人获得优惠的数量上限和活动已经发送的优惠数量
	function queryActivity(activity_id){
	   // query  limit, total_reward, single_reward, a_start_time, a_end_time from the table discount_activityRule
	   var queryByActivityId = 'SELECT  * FROM discount_activityRule WHERE activity_id="' + activity_id + '"';
	   console.log('queryByActivityId');
	   console.log(queryByActivityId);
	   mysql.query(queryByActivityId, function(err, rows, fields){
		   if (err) {
			   console.log('status: 1002');
			   return next(err);
		   }
		   var activity = rows[0]
		   if (activity) {
			   var single_limit = activity.single_limit;
			   var total_reward = activity.total_reward;
			   var single_reward = activity.single_reward;
			   var a_start_time = activity.a_start_time;
			   var a_end_time = activity.a_end_time;
			   var sent_reward = activity.sent_reward;
			   if (single_limit && total_reward && single_reward && a_start_time && a_end_time) {
				   // get current time and judge if time during the activity;
				   var current_time = new Date();
				   var start_time = new Date(a_start_time).getTime();
				   var end_time = new Date(a_end_time).getTime();
				   if (current_time > start_time && current_time < end_time && sent_reward < total_reward) {
					   console.log('处在活动期范围内,并且活动发行的优惠数量未达到上限');
					   // var data =  {'single_limit': single_limit, 'sent_reward': sent_reward, 'single_reward': single_reward}
					   return ep.emit('queryActivity', activity)
				   }else {
					   console.log('处在活动期范围外,或者活动发行的优惠数量已达到上限');
				   }
			   }else {
				   console.log('活动表中某些字段不完整');
			   }
		   }
		})
	}


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
					console.log('status: 1009');
					return next(err);
				}
				console.log('写入个人-活动的总表 成功');
			})
		})
	}

	// 将活动已发送币的数量加上活动单次赠送的数量
	function upActivityAccount(activity_id, sent_reward, single_reward){
		var sent_reward = sent_reward + single_reward;
		var upActivityTotal = 'UPDATE discount_activityRule SET sent_reward=' + sent_reward + ' WHERE activity_id="' + activity_id + '"';
		console.log('upActivityTotal');
		console.log(upActivityTotal);
		mysql.query(upActivityTotal, function(err, rows, fields){
			if (err) {
				console.log('status: 1005');
				return next(err);
			}
			console.log('将活动已发送币的数量加上活动单次赠送的数量成功');
			console.log(rows);
		})
	}
}



exports.registActivity = function(req, res, next, register_id){
	var activity_id = 'bbb';

	var curr_time = moment().format('YYYY-MM-DD hh:mm:ss');

	var ep = new eventproxy();
	ep.fail(function(err){
		 next(err)
		 log2_sql.log2sql(req, res, next, err);
	});

	ep.on('queryActivity', function(activity){
		var product_ids = activity.product_ids;
		var effect_time = activity.effect_time;
		var dead_time = activity.dead_time;
		var sent_reward = activity.sent_reward;
		var single_reward = activity.single_reward;
		var invitee_id = '';
		insertGETXDiscountLog(register_id, product_ids,curr_time,  effect_time, dead_time, single_reward, invitee_id, activity_id)
		insertGETXPersonActi(register_id, product_ids,curr_time,  effect_time, dead_time, single_reward, activity_id);
		upActivityAccount(activity_id, sent_reward, single_reward)
	})
	queryActivity(activity_id);


	// 根据活动ID获取活动等信息  判断完成并且通过后返回单人获得优惠的数量,单人获得优惠的数量上限和活动已经发送的优惠数量
	function queryActivity(activity_id){
	   // query  limit, total_reward, single_reward, a_start_time, a_end_time from the table discount_activityRule
	   var queryByActivityId = 'SELECT  * FROM discount_activityRule WHERE activity_id="' + activity_id + '"';
	   console.log('queryByActivityId');
	   console.log(queryByActivityId);
	   mysql.query(queryByActivityId, function(err, rows, fields){
		   if (err) {
			   console.log('status: 1002');
			   return next(err);
		   }
		   var activity = rows[0]
		   if (activity) {
			   var single_limit = activity.single_limit;
			   var total_reward = activity.total_reward;
			   var single_reward = activity.single_reward;
			   var a_start_time = activity.a_start_time;
			   var a_end_time = activity.a_end_time;
			   var sent_reward = activity.sent_reward;
			   if (single_limit && total_reward && single_reward && a_start_time && a_end_time) {
				   // get current time and judge if time during the activity;
				   var current_time = new Date();
				   var start_time = new Date(a_start_time).getTime();
				   var end_time = new Date(a_end_time).getTime();
				   if (current_time > start_time && current_time < end_time && sent_reward < total_reward) {
					   console.log('处在活动期范围内,并且活动发行的优惠数量未达到上限');
					   // var data =  {'single_limit': single_limit, 'sent_reward': sent_reward, 'single_reward': single_reward}
					   return ep.emit('queryActivity', activity)
				   }else {
					   console.log('处在活动期范围外,或者活动发行的优惠数量已达到上限');
				   }
			   }else {
				   console.log('活动表中某些字段不完整');
			   }
		   }
		})
	}

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
					console.log('status: 1009');
					return next(err);
				}
				console.log('写入个人-活动的总表 成功');
			})
		})
	}

	// 将活动已发送币的数量加上活动单次赠送的数量
	function upActivityAccount(activity_id, sent_reward, single_reward){
		var sent_reward = sent_reward + single_reward;
		var upActivityTotal = 'UPDATE discount_activityRule SET sent_reward=' + sent_reward + ' WHERE activity_id="' + activity_id + '"';
		console.log('upActivityTotal');
		console.log(upActivityTotal);
		mysql.query(upActivityTotal, function(err, rows, fields){
			if (err) {
				console.log('status: 1005');
				return next(err);
			}
			console.log('将活动已发送币的数量加上活动单次赠送的数量成功');
			console.log(rows);
		})
	}
	// 将用户获得的GETX记录到discount_getx_log
	function insertGETXDiscountLog(user_id, product_ids,create_date,  effect_time, dead_time, total_count, invitee_id, activity_id){
		var insertGETXDiscountLog = 'INSERT INTO discount_getx_log(user_id, product_ids,create_time,  effect_time, dead_time, total_count,  invitee_id, activity_id, status) VALUES(?,?,?,?,?,?,?,?,?)';
		var params_insertGETXDiscountLog = [user_id, product_ids,create_date,  effect_time, dead_time, total_count,  invitee_id, activity_id, 2];

		console.log('insertGETXDiscountLog');
		console.log(insertGETXDiscountLog);
		console.log(params_insertGETXDiscountLog);
		mysql.query(insertGETXDiscountLog, params_insertGETXDiscountLog, function(err, rows, fields){
			if (err) {
				console.log('status: 1009');
				return next(err);
			}
			ep.emit('insertGETXDiscountLog')
			console.log('写入用户获得优惠的记录 成功');
		})
	}
}
