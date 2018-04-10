var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
// var User           = require('../proxy').User;
var mail           = require('../common/mail');
var tools          = require('../common/tools');
var utility        = require('utility');
// var authMiddleWare = require('../../middlewares/auth');
var uuid           = require('node-uuid');
var mysql = require('../db');
var svgCaptcha = require('svg-captcha');
var moment = require('moment');
exports.index = function (req, res, next) {

	var queryName = 'SELECT * FROM blockdata';
	mysql.query(queryName, function(err, rows, fields){
      if (err) {
        return ep.emit('prop_err', '服务器繁忙');
      }
      var name_list = rows;
      //console.log(mutual_list);

      name_list = getArrayItems(name_list, 20);
      console.log(name_list);

      var lan=req.session.lan
		if(lan){
			res.render('blockchain_search/blockchain_search_en',{
				'name':'blockchain_search',
				'title':'blockchainQuery',
				'member_list':name_list
			});
			return
		}
		res.render('blockchain_search/blockchain_search',{
			'name':'blockchain_search',
			'title':'区块链查询',
			'member_list':name_list
		});

      
    })



	

	//从一个给定的数组arr中,随机返回num个不重复项
	function getArrayItems(arr, num) {
	    //新建一个数组,将传入的数组复制过来,用于运算,而不要直接操作传入的数组;
	    var temp_array = new Array();
	    for (var index in arr) {
	        temp_array.push(arr[index]);
	    }
	    //取出的数值项,保存在此数组
	    var return_array = new Array();
	    for (var i = 0; i<num; i++) {
	        //判断如果数组还有可以取出的元素,以防下标越界
	        if (temp_array.length>0) {
	            //在数组中产生一个随机索引
	            var arrIndex = Math.floor(Math.random()*temp_array.length);
	            //将此随机索引的对应的数组元素值复制出来
	            return_array[i] = temp_array[arrIndex];
	            //然后删掉此索引的数组元素,这时候temp_array变为新的数组
	            temp_array.splice(arrIndex, 1);
	        } else {
	            //数组中数据项取完后,退出循环,比如数组本来只有10项,但要求取出20项.
	            break;
	        }
	    }
	    return return_array;
	}

};