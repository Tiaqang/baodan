/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');

//测试页
var test = require('./controllers/getx_test')

// 网站主页
// var index = require('./controllers/index/')
var sign = require('./controllers/index/getx_sign')
var home = require('./controllers/index/getx_home');

// 产品模块
var product=require('./controllers/product/getx_product')
// 广场（咨询、活动、社区）
var square=require('./controllers/square/getx_square')
//个人中心
var personal = require('./controllers/personal/getx_personalinfo')

// 公示模块
var publicity=require('./controllers/publicity/getx_publicity')
//检验登陆状态模块
var auth = require('./middlewares/getx_auth');

//文件

var doc = require('./controllers/getx_doc');

//我的账户
var account=require('./controllers/getx_account');

//我的保障
//var personal=require('./controllers/personal/getx_personal')
//帮助中心
var assistance=require('./controllers/getx_assistance')


//支付页

var pay=require('./controllers/pay/getx_pay')

//区块链查询页
var blockchain=require('./controllers/getx_blockchain_search')


// 购买产品页

var purchase=require('./controllers/getx_purchase')

// 关于我们

var about = require('./controllers/getx_about')

var router = express.Router();

// 网站主页
router.get('/',home.index);
// 获取图片验证码
router.post('/getCode', sign.getCode)
// 保存用户信息（注册）
router.post("/signup", sign.signup)
// 验证用户登录
router.post("/signin", sign.signin)
//查看用户登录状态
router.post("/islogin", sign.islogin)
// 发送邮箱验证码（注册）
router.post('/sendEmailCode', sign.sendEmailCode)
// 发送邮箱验证码（重置密码）
router.post('/sendEmailCodeSetPass', sign.sendEmailCodeSetPass)
// 保存重置的密码
router.post('/password_reset', sign.resetPass)
//切换语言
router.post('/changeLan', sign.changeLan)

// 修改用户信息
router.post('/modifyUserDetil', sign.modifyUserDetil)
// 退出登录
router.get('/signout', sign.signout)

//文件路由

router.get('/doc', doc.index)

// 产品模块
// 之前的路由
router.get('/product',product.index);
// 获取所有产品
//router.get('/products/',product.getAllProducts);
// 按照产品ID获取产品
//router.get('/product/:id',product.getProduct);
// 购买并保存保单信息
//router.post('/saveGuarantee',  product.saveGuarantee)
//购买产品页
router.get('/purchase',auth.userRequired,purchase.index);

router.post('/purchase',auth.userRequired,purchase.saveInsurInfo)

//支付页
router.get('/pay',pay.index);
//支付成功，更新保单状态，区块信息
router.post('/pay/updateInsurance',pay.updateInsurance);

//查询保单信息

router.post('/purchase/insuranceInfo',purchase.getInsuranceInfo);


//关于我们

router.get('/about',about.index);

// 广场（咨询、活动、社区）
router.get('/square',square.index);
//资讯详情
router.get('/square/news',square.news);

// 公示
router.get('/publicity',publicity.index);
//公示详情
router.get('/publicity_details/:id',publicity.details);
//每期公示
router.get('/publicity_each',publicity.publicity_each);
//运营公示
router.get('/publicity_operations',publicity.publicity_operations);
// 个人中心
// 查看个人中心主页
router.get('/personal',auth.userRequired,personal.index);
// 修改个人信息
router.get('/modifyPersonalInfo',auth.userRequired,personal.modifyPersonalInfo);
// 查看我的所有保障
router.get('/getPersonalAllGuards',auth.userRequired,personal.getPersonalAllGuards);
// 按照保障ID我的保障
router.get('/getPersonalGuard/:id',auth.userRequired,personal.getPersonalGuard);


//申请互助
router.get('/quitGuard/:id',auth.userRequired,personal.quitGuard);
// 申请退出
router.get('/applyGuard',auth.userRequired,personal.applyGuard);
//区块链查询
router.get('/blockchain_search',blockchain.index);

//退出信息提交
router.post('/quit_info',personal.quit_info);


//我的账户
router.get('/account',account.index);

//充值记录
router.get('/account/pay_record',auth.userRequired,account.pay_record);

//优惠记录

//router.get('/account/preferential',auth.userRequired,account.preferential);

//帮助中心
router.get('/assistance',assistance.index);


module.exports = router;
