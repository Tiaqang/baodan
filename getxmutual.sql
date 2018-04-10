/*
Navicat MySQL Data Transfer

Source Server         : svn
Source Server Version : 50721
Source Host           : 192.168.31.102:3306
Source Database       : getxmutual

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2018-04-03 20:53:13
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for account_personal
-- ----------------------------
DROP TABLE IF EXISTS `account_personal`;
CREATE TABLE `account_personal` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '会员id',
  `account_type` int(4) NOT NULL COMMENT '账户类型，1、意外互助计划, 2;赠送的getx，3、赠送积分',
  `account_sum` int(12) NOT NULL COMMENT '账户总额',
  `status` int(4) NOT NULL COMMENT '状态: 1.正常, 2.锁定',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `update_date` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='个人账户统计表';

-- ----------------------------
-- Records of account_personal
-- ----------------------------

-- ----------------------------
-- Table structure for account_personalpay_record
-- ----------------------------
DROP TABLE IF EXISTS `account_personalpay_record`;
CREATE TABLE `account_personalpay_record` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '注册会员id',
  `pay_type` int(4) NOT NULL COMMENT '消费类型，购买意外互助计划, 1; 充值意外互助计划 2',
  `insurance_id` varchar(64) NOT NULL COMMENT '保单编号',
  `pay_account` int(4) NOT NULL COMMENT '使用账户, 自有getx 1, /自有eth 2;  /赠送的getx3',
  `pay_sum` int(32) NOT NULL COMMENT '支付金额数量',
  `getx_mount` int(32) NOT NULL COMMENT '当前订单选取的getx数量',
  `exchange_rate` varchar(128) NOT NULL COMMENT '当前汇率，eth兑getx、积分兑getx',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `block_num` int(16) DEFAULT NULL COMMENT '区块高度号',
  `block_transactionhash` varchar(128) DEFAULT NULL COMMENT '区块交易hash',
  PRIMARY KEY (`id`,`user_id`,`insurance_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COMMENT='个人保单消费流水表';

-- ----------------------------
-- Records of account_personalpay_record
-- ----------------------------

-- ----------------------------
-- Table structure for account_present_record
-- ----------------------------
DROP TABLE IF EXISTS `account_present_record`;
CREATE TABLE `account_present_record` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '优惠会员id',
  `present_type` int(4) NOT NULL COMMENT '优惠类型，1、系统赠送getx, 2; 邀请他人加入计划赠送，3、赠送积分',
  ` present_sum` int(12) NOT NULL COMMENT '优惠数量',
  `status` int(4) NOT NULL COMMENT '状态, 1,待生效 2已生效，3，已过期',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `use_range` int(4) DEFAULT NULL COMMENT '使用范围，0，全部',
  `use_finish` datetime NOT NULL COMMENT '使用截止日期',
  PRIMARY KEY (`id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='活动赠送个人优惠流水表';

-- ----------------------------
-- Records of account_present_record
-- ----------------------------

-- ----------------------------
-- Table structure for account_syspay_record
-- ----------------------------
DROP TABLE IF EXISTS `account_syspay_record`;
CREATE TABLE `account_syspay_record` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `sysytem_id` varchar(64) NOT NULL COMMENT '管理员id',
  `pay_type` int(4) NOT NULL COMMENT '动账类型，1、赠送的getx转入合约; 2、退出计划，3、理赔',
  `user_id` varchar(64) NOT NULL COMMENT '用户id',
  `pay_account` int(4) NOT NULL COMMENT '使用账户说明',
  `from_address` varchar(64) NOT NULL COMMENT '支付地址',
  `to_address` varchar(64) NOT NULL COMMENT '交易地址',
  `pay_sum` int(32) NOT NULL COMMENT '支付金额数量',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `block_num` int(16) DEFAULT NULL COMMENT '区块高度号',
  `block_transactionhash` varchar(128) DEFAULT NULL COMMENT '区块交易hash',
  PRIMARY KEY (`id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统(管理员)动账流水表';

-- ----------------------------
-- Records of account_syspay_record
-- ----------------------------

-- ----------------------------
-- Table structure for account_system
-- ----------------------------
DROP TABLE IF EXISTS `account_system`;
CREATE TABLE `account_system` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '会员id',
  `mutual_type` int(4) NOT NULL COMMENT '互助计划类型，1、意外互助计划, 2;妈妈互助',
  `real_pay_sum` int(12) NOT NULL COMMENT '实际支付总额getx',
  `present_pay_sum` int(4) NOT NULL COMMENT '赠送的getx支付总额',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `update_date` datetime NOT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='系统账户统计表';

-- ----------------------------
-- Records of account_system
-- ----------------------------

-- ----------------------------
-- Table structure for activityRule
-- ----------------------------
DROP TABLE IF EXISTS `activityRule`;
CREATE TABLE `activityRule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `activity_name` varchar(64) NOT NULL COMMENT '活动名称',
  `a_start_time` datetime NOT NULL COMMENT '活动开始时间',
  `a_end_time` datetime NOT NULL COMMENT '活动结束时间',
  `activity_rule` varchar(64) DEFAULT NULL COMMENT '活动规则',
  `effect_time` datetime DEFAULT NULL COMMENT '赠送GETX/优惠券的使用期限（开始）',
  `dead_time` datetime DEFAULT NULL COMMENT '赠送GETX/优惠券的使用期限（结束）',
  `limit` int(11) DEFAULT '100000' COMMENT '单人获得GETX的上限,默认10W',
  `isWithdraw` int(11) DEFAULT NULL COMMENT 'GETX能否提现 1：能，2：不能',
  PRIMARY KEY (`id`,`activity_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of activityRule
-- ----------------------------

-- ----------------------------
-- Table structure for claim_management
-- ----------------------------
DROP TABLE IF EXISTS `claim_management`;
CREATE TABLE `claim_management` (
  `id` varchar(40) NOT NULL COMMENT '主键id',
  `mail_theme` varchar(255) DEFAULT NULL COMMENT '发送者主题',
  `mail_addresser` varchar(255) DEFAULT NULL COMMENT '发件人',
  `mail_sendtime` varchar(55) DEFAULT NULL COMMENT '发送时间',
  `mail_read` varchar(55) DEFAULT NULL COMMENT '是否已读',
  `mail_priority` varchar(6) DEFAULT NULL COMMENT '邮件优先级',
  `mail_message_size` varchar(55) DEFAULT NULL COMMENT '邮件大小',
  `mail_attachment` varchar(55) DEFAULT NULL COMMENT '是否包含附件',
  `mail_txet` text COMMENT '邮件正文',
  `mail_file_address` varchar(255) DEFAULT NULL COMMENT '邮件文件地址',
  `audit_status` varchar(10) DEFAULT NULL COMMENT '审核状态',
  `creation_time` datetime DEFAULT NULL COMMENT '创建时间',
  `mail_emil` varchar(255) DEFAULT NULL COMMENT '用户邮箱',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for log_record
-- ----------------------------
DROP TABLE IF EXISTS `log_record`;
CREATE TABLE `log_record` (
  `id` varchar(40) NOT NULL COMMENT '主键',
  `messages_purged` varchar(50) DEFAULT NULL COMMENT '邮件总数',
  `functional_operation` varchar(255) DEFAULT NULL COMMENT '功能操作',
  `operation_time` varchar(55) DEFAULT NULL COMMENT '操作时间',
  `creation_time` datetime DEFAULT NULL COMMENT '创建时间',
  `operation_user` varchar(55) DEFAULT NULL COMMENT '发送邮件用户',
  `repeat_email` varchar(50) DEFAULT NULL COMMENT '重复邮件',
  `operation_informatio` text COMMENT '运行信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of log_record
-- ----------------------------

-- ----------------------------
-- Table structure for log_service
-- ----------------------------
DROP TABLE IF EXISTS `log_service`;
CREATE TABLE `log_service` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `email` varchar(32) NOT NULL COMMENT '注册会员标识',
  `service_name` varchar(400) DEFAULT NULL COMMENT '调用服务名称',
  `invoke_time` datetime DEFAULT NULL COMMENT '调用时间',
  `ip` varchar(24) DEFAULT NULL COMMENT '访问ip',
  `req_header` varchar(1024) DEFAULT NULL COMMENT '请求报文',
  `res_header` varchar(1024) DEFAULT NULL COMMENT '响应报文',
  `status` int(4) DEFAULT NULL COMMENT '状态',
  `duration` int(11) DEFAULT NULL COMMENT '持续时间',
  `req_msg` varchar(1024) DEFAULT NULL COMMENT '请求参数',
  `res_msg` varchar(1024) DEFAULT NULL COMMENT '返回参数',
  PRIMARY KEY (`id`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=utf8 COMMENT='系统服务日志表';

-- ----------------------------
-- Records of log_service
-- ----------------------------

-- ----------------------------
-- Table structure for `mutual_insurance`
-- ----------------------------
DROP TABLE IF EXISTS `mutual_insurance`;
CREATE TABLE `mutual_insurance` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(32) DEFAULT NULL COMMENT '投保人id(按规则生成.本人为会员id)',
  `insurance_id` varchar(32) NOT NULL COMMENT '保单编号(规则生成）',
  `mutual_id` varchar(32) DEFAULT NULL COMMENT '互助计划编号',
  `relationship` varchar(60) DEFAULT NULL COMMENT '与投保人关系',
  `name` varchar(64) DEFAULT NULL COMMENT '姓名',
  `phone` varchar(24) DEFAULT NULL COMMENT '手机号',
  `birthday` varchar(60) DEFAULT NULL COMMENT '出生年月日',
  `identify_id` varchar(64) DEFAULT NULL COMMENT '证件号',
  `getx_balance` float DEFAULT NULL COMMENT '充值的getx余额',
  `discount_getx_balance` float DEFAULT NULL COMMENT '赠送的GETX余额',
  `points_balance` float DEFAULT NULL COMMENT '赠送积分的GETX余额',
  `status` tinyint(2) DEFAULT NULL COMMENT '保单状态',
  `out_times` int(11) DEFAULT NULL COMMENT '互助他人次数',
  `out_monney` float DEFAULT NULL COMMENT '互助他人金额',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `sex` int(11) DEFAULT NULL COMMENT '1:male;2:felmale',
  `country` varchar(10) DEFAULT NULL,
  `email` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`id`,`insurance_id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `insurance_id` (`insurance_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=132 DEFAULT CHARSET=utf8 COMMENT='互助计划的投保保单';

-- ----------------------------
-- Records of mutual_insurance
-- ----------------------------

-- ----------------------------
-- Table structure for mutual_param
-- ----------------------------
DROP TABLE IF EXISTS `mutual_param`;
CREATE TABLE `mutual_param` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `mutual_id` int(11) NOT NULL COMMENT '互助计划编码',
  `mutual_name` varchar(40) NOT NULL COMMENT '互助计划名称',
  `about` varchar(200) DEFAULT NULL COMMENT '互助计划简介',
  `content` varchar(400) NOT NULL COMMENT '互助计划内容',
  `rule` varchar(200) DEFAULT NULL COMMENT '互助计划规则',
  `proof_day` int(11) DEFAULT NULL COMMENT '生效天数',
  `delay_day` int(11) DEFAULT NULL COMMENT '宽限期天数',
  `age_rang` int(3) DEFAULT NULL COMMENT '参保年龄范围',
  `insure_times` int(11) DEFAULT NULL COMMENT '可保障次数',
  `insure_range` int(11) DEFAULT NULL COMMENT '保障范围',
  `low_money` int(11) DEFAULT NULL COMMENT '金额提醒位（账户最低余额）',
  `one_money` int(11) DEFAULT NULL COMMENT '单次互助最高扣款金额',
  `insure_money` int(11) DEFAULT NULL COMMENT '最高保障金额',
  `column1` varchar(40) DEFAULT NULL COMMENT '预留字段1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='互助计划参数说明表';

-- ----------------------------
-- Records of mutual_param
-- ----------------------------
INSERT INTO `mutual_param` VALUES ('1', '1', '保链百万意外伤害互助计划', '保链互助-保链百万意外伤害互助计划', '保链百万意外伤害互助计划', '保链百万意外伤害互助计划规则', '30', '30', '60', '20', '222222', '100', '500', '10000', null);

-- ----------------------------
-- Table structure for mutual_payment
-- ----------------------------
DROP TABLE IF EXISTS `mutual_payment`;
CREATE TABLE `mutual_payment` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `payment_id` varchar(32) NOT NULL COMMENT '理赔id',
  `publicity_id` int(11) NOT NULL COMMENT '公示id',
  `sum_person` int(11) NOT NULL COMMENT '有效总人数',
  `sum_money` int(11) NOT NULL COMMENT '有效总资金',
  `average_money` int(11) NOT NULL COMMENT '人均扣款额度',
  `sum_payment` int(11) NOT NULL COMMENT '理赔总额',
  `create_time` int(11) NOT NULL COMMENT '创建时间',
  `block_num` int(11) NOT NULL COMMENT '区块号',
  `block_data` int(11) NOT NULL COMMENT '区块数据',
  PRIMARY KEY (`id`,`payment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='互助计划理赔方案表';

-- ----------------------------
-- Records of mutual_payment
-- ----------------------------

-- ----------------------------
-- Table structure for mutual_publicity
-- ----------------------------
DROP TABLE IF EXISTS `mutual_publicity`;
CREATE TABLE `mutual_publicity` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `publicity_id` int(11) NOT NULL COMMENT '公示编号',
  `insurance_id` int(11) NOT NULL COMMENT '保单编号',
  `reason` int(11) NOT NULL COMMENT '互助原因',
  `publicity_time` int(11) NOT NULL COMMENT '公示时间',
  `benefit` int(11) NOT NULL COMMENT '受益人',
  `add_admin` int(11) NOT NULL COMMENT '提交管理员',
  `add_time` int(11) NOT NULL COMMENT '提交时间',
  `blockchain_id` int(11) NOT NULL COMMENT '区块号',
  `blockchain_data` int(11) NOT NULL COMMENT '区块数据',
  PRIMARY KEY (`id`,`publicity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='互助计划的公示表';

-- ----------------------------
-- Records of mutual_publicity
-- ----------------------------

-- ----------------------------
-- Table structure for sys_parameters
-- ----------------------------
DROP TABLE IF EXISTS `sys_parameters`;
CREATE TABLE `sys_parameters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(384) NOT NULL COMMENT '中文名',
  `ename` varchar(384) NOT NULL COMMENT '英文名',
  `param_value` varchar(256) NOT NULL COMMENT '参数值',
  `param_type` varchar(32) NOT NULL COMMENT '参数类型：1(证件类型)；2（账户类型）；3（加入计划状态）；4（性别）；5（国家类）；6（意外类型）；7（与本人关系）',
  `namecode` varchar(96) DEFAULT NULL COMMENT '参数编码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=202 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sys_parameters
-- ----------------------------
INSERT INTO `sys_parameters` VALUES ('1', '中国', 'China', '1', '5', 'ZG');
INSERT INTO `sys_parameters` VALUES ('2', '阿富汗', 'Afghanistan', '2', '5', 'AFH');
INSERT INTO `sys_parameters` VALUES ('3', '阿拉伯联合酋长国', 'Arab', '3', '5', 'ALBLHQZG');
INSERT INTO `sys_parameters` VALUES ('4', '阿曼', 'Oman', '4', '5', 'AM');
INSERT INTO `sys_parameters` VALUES ('5', '阿塞拜疆共和国', 'Azerbaijan', '5', '5', 'ASBJGHG');
INSERT INTO `sys_parameters` VALUES ('6', '巴基斯坦', 'Pakistan', '6', '5', 'BJST');
INSERT INTO `sys_parameters` VALUES ('7', '巴勒斯坦', 'Palestine', '7', '5', 'BLST');
INSERT INTO `sys_parameters` VALUES ('8', '巴林', 'Bahrain', '8', '5', 'BL');
INSERT INTO `sys_parameters` VALUES ('9', '不丹', 'Bhutan', '9', '5', 'BD');
INSERT INTO `sys_parameters` VALUES ('10', '朝鲜', 'North Korea', '10', '5', 'CX');
INSERT INTO `sys_parameters` VALUES ('11', '东帝汶', 'Timor', '11', '5', 'DDW');
INSERT INTO `sys_parameters` VALUES ('12', '菲律宾', 'Philippines', '12', '5', 'FLB');
INSERT INTO `sys_parameters` VALUES ('13', '格鲁吉亚', 'Georgia', '13', '5', 'GLJY');
INSERT INTO `sys_parameters` VALUES ('14', '哈萨克斯坦', 'Kazakhstan', '14', '5', 'HSKST');
INSERT INTO `sys_parameters` VALUES ('15', '韩国', 'Korea', '15', '5', 'HG');
INSERT INTO `sys_parameters` VALUES ('16', '吉尔吉斯共和国', 'Kirgizstan', '16', '5', 'JEJSGHG');
INSERT INTO `sys_parameters` VALUES ('17', '柬埔寨', 'Cambodia', '17', '5', 'JPZ');
INSERT INTO `sys_parameters` VALUES ('18', '卡塔尔', 'Qatar', '18', '5', 'KTE');
INSERT INTO `sys_parameters` VALUES ('19', '科威特', 'Kuwait', '19', '5', 'KWT');
INSERT INTO `sys_parameters` VALUES ('20', '老挝', 'Laos', '20', '5', 'LW');
INSERT INTO `sys_parameters` VALUES ('21', '黎巴嫩', 'Lebanon', '21', '5', 'LBN');
INSERT INTO `sys_parameters` VALUES ('22', '马尔代夫', 'Maldives', '22', '5', 'MEDF');
INSERT INTO `sys_parameters` VALUES ('23', '马来西亚', 'Malaysia', '23', '5', 'MLXY');
INSERT INTO `sys_parameters` VALUES ('24', '蒙古', 'Mongolia', '24', '5', 'MG');
INSERT INTO `sys_parameters` VALUES ('25', '孟加拉国', 'Bangladesh', '25', '5', 'MJLG');
INSERT INTO `sys_parameters` VALUES ('26', '缅甸', 'Myanmar', '26', '5', 'MD');
INSERT INTO `sys_parameters` VALUES ('27', '尼泊尔', 'Nepal', '27', '5', 'NBE');
INSERT INTO `sys_parameters` VALUES ('28', '日本', 'Japan', '28', '5', 'RB');
INSERT INTO `sys_parameters` VALUES ('29', '塞浦路斯', 'Cyprus', '29', '5', 'SPLS');
INSERT INTO `sys_parameters` VALUES ('30', '沙特阿拉伯', 'Saudi Arabia', '30', '5', 'STALB');
INSERT INTO `sys_parameters` VALUES ('31', '斯里兰卡', 'Srilanka', '31', '5', 'SLLK');
INSERT INTO `sys_parameters` VALUES ('32', '塔吉克斯坦', 'Tajikistan', '32', '5', 'TJKST');
INSERT INTO `sys_parameters` VALUES ('33', '泰国', 'Thailand', '33', '5', 'TG');
INSERT INTO `sys_parameters` VALUES ('34', '土耳其', 'Turkey', '34', '5', 'TEQ');
INSERT INTO `sys_parameters` VALUES ('35', '土库曼斯坦', 'Turkmenistan', '35', '5', 'TKMST');
INSERT INTO `sys_parameters` VALUES ('36', '文莱', 'Brunei', '36', '5', 'WL');
INSERT INTO `sys_parameters` VALUES ('37', '乌兹别克斯坦', 'Uzbekistan', '37', '5', 'WZBKST');
INSERT INTO `sys_parameters` VALUES ('38', '新加坡', 'Singapore', '38', '5', 'XJP');
INSERT INTO `sys_parameters` VALUES ('39', '叙利亚', 'Syria', '39', '5', 'XLY');
INSERT INTO `sys_parameters` VALUES ('40', '亚美尼亚共和国', 'Armenia', '40', '5', 'YMNYGHG');
INSERT INTO `sys_parameters` VALUES ('41', '也门', 'Yemen', '41', '5', 'YM');
INSERT INTO `sys_parameters` VALUES ('42', '伊朗', 'Iran', '42', '5', 'YL');
INSERT INTO `sys_parameters` VALUES ('43', '伊拉克', 'Iraq', '43', '5', 'YLK');
INSERT INTO `sys_parameters` VALUES ('44', '以色列', 'Israel', '44', '5', 'YSL');
INSERT INTO `sys_parameters` VALUES ('45', '印度', 'India', '45', '5', 'YD');
INSERT INTO `sys_parameters` VALUES ('46', '印度尼西亚', 'Indonesia', '46', '5', 'YDNXY');
INSERT INTO `sys_parameters` VALUES ('47', '约旦', 'Jordan', '47', '5', 'YD');
INSERT INTO `sys_parameters` VALUES ('48', '越南', 'Vietnam', '48', '5', 'YN');
INSERT INTO `sys_parameters` VALUES ('49', '安道尔', 'Andorra', '49', '5', 'ADE');
INSERT INTO `sys_parameters` VALUES ('50', '奥地利', 'Austria', '50', '5', 'ADL');
INSERT INTO `sys_parameters` VALUES ('51', '阿尔巴尼亚', 'Albania', '51', '5', 'AEBNY');
INSERT INTO `sys_parameters` VALUES ('52', '爱尔兰', 'Ireland', '52', '5', 'AEL');
INSERT INTO `sys_parameters` VALUES ('53', '爱沙尼亚', 'Estonia', '53', '5', 'ASNY');
INSERT INTO `sys_parameters` VALUES ('54', '冰岛', 'Iceland', '54', '5', 'BD');
INSERT INTO `sys_parameters` VALUES ('55', '白俄罗斯', 'Belarus', '55', '5', 'BELS');
INSERT INTO `sys_parameters` VALUES ('56', '保加利亚', 'Bulgaria', '56', '5', 'BJLY');
INSERT INTO `sys_parameters` VALUES ('57', '波兰', 'Poland', '57', '5', 'BL');
INSERT INTO `sys_parameters` VALUES ('58', '波斯尼亚和黑塞哥维那', 'Bosnia', '58', '5', 'BSNYHHSGWN');
INSERT INTO `sys_parameters` VALUES ('59', '比利时', 'Belgium', '59', '5', 'BLS');
INSERT INTO `sys_parameters` VALUES ('60', '德国', 'Germany', '60', '5', 'DG');
INSERT INTO `sys_parameters` VALUES ('61', '丹麦', 'Denmark', '61', '5', 'DM');
INSERT INTO `sys_parameters` VALUES ('62', '俄罗斯联邦', 'Russia', '62', '5', 'ELSLB');
INSERT INTO `sys_parameters` VALUES ('63', '法国', 'France', '63', '5', 'FG');
INSERT INTO `sys_parameters` VALUES ('64', '芬兰', 'Finland', '64', '5', 'FL');
INSERT INTO `sys_parameters` VALUES ('65', '荷兰', 'Holand', '65', '5', 'HL');
INSERT INTO `sys_parameters` VALUES ('66', '捷克', 'Czech', '66', '5', 'JK');
INSERT INTO `sys_parameters` VALUES ('67', '克罗地亚', 'Croatia', '67', '5', 'KLDY');
INSERT INTO `sys_parameters` VALUES ('68', '拉脱维亚', 'Latvia', '68', '5', 'LTWY');
INSERT INTO `sys_parameters` VALUES ('69', '立陶宛', 'Lithuania', '69', '5', 'LTW');
INSERT INTO `sys_parameters` VALUES ('70', '列支敦士登', 'Liechtenstein', '70', '5', 'LZDSD');
INSERT INTO `sys_parameters` VALUES ('71', '罗马尼亚', 'Romania', '71', '5', 'LMNY');
INSERT INTO `sys_parameters` VALUES ('72', '马其顿', 'Macedonia', '72', '5', 'MQD');
INSERT INTO `sys_parameters` VALUES ('73', '马耳他', 'Malta', '73', '5', 'MET');
INSERT INTO `sys_parameters` VALUES ('74', '卢森堡', 'Luxembourg', '74', '5', 'LSB');
INSERT INTO `sys_parameters` VALUES ('75', '摩纳哥', 'Monaco', '75', '5', 'MNG');
INSERT INTO `sys_parameters` VALUES ('76', '摩尔多瓦', 'Moldova', '76', '5', 'MEDW');
INSERT INTO `sys_parameters` VALUES ('77', '挪威', 'Norway', '77', '5', 'NW');
INSERT INTO `sys_parameters` VALUES ('78', '塞尔维亚和黑山共和国', 'Serbia', '78', '5', 'SEWYHHSGHG');
INSERT INTO `sys_parameters` VALUES ('79', '葡萄牙', 'Portugal', '79', '5', 'PTY');
INSERT INTO `sys_parameters` VALUES ('80', '瑞典', 'Sweden', '80', '5', 'RD');
INSERT INTO `sys_parameters` VALUES ('81', '瑞士', 'Switzerland', '81', '5', 'RS');
INSERT INTO `sys_parameters` VALUES ('82', '斯洛伐克', 'Slovak', '82', '5', 'SLFK');
INSERT INTO `sys_parameters` VALUES ('83', '斯洛文尼亚', 'Slovenia', '83', '5', 'SLWNY');
INSERT INTO `sys_parameters` VALUES ('84', '圣马力诺', 'San Marino', '84', '5', 'SMLN');
INSERT INTO `sys_parameters` VALUES ('85', '乌克兰', 'Ukraine', '85', '5', 'WKL');
INSERT INTO `sys_parameters` VALUES ('86', '西班牙', 'Spain', '86', '5', 'XBY');
INSERT INTO `sys_parameters` VALUES ('87', '希腊', 'Greece', '87', '5', 'XL');
INSERT INTO `sys_parameters` VALUES ('88', '匈牙利', 'Hungary', '88', '5', 'XYL');
INSERT INTO `sys_parameters` VALUES ('89', '意大利', 'Italy', '89', '5', 'YDL');
INSERT INTO `sys_parameters` VALUES ('90', '英国', 'England', '90', '5', 'YG');
INSERT INTO `sys_parameters` VALUES ('91', '加拿大', 'Canada', '91', '5', 'JND');
INSERT INTO `sys_parameters` VALUES ('92', '美国', 'America', '92', '5', 'MG');
INSERT INTO `sys_parameters` VALUES ('93', '墨西哥', 'Mexico', '93', '5', 'MXG');
INSERT INTO `sys_parameters` VALUES ('94', '安提瓜和巴布达', 'Antigua and Barbuda', '94', '5', 'ATGHBBD');
INSERT INTO `sys_parameters` VALUES ('95', '巴巴多斯', 'Barbados', '95', '5', 'BBDS');
INSERT INTO `sys_parameters` VALUES ('96', '多米尼克', 'Dominica', '96', '5', 'DMNK');
INSERT INTO `sys_parameters` VALUES ('97', '古巴共和国', 'Guba', '97', '5', 'GBGHG');
INSERT INTO `sys_parameters` VALUES ('98', '格林纳达', 'Grenada', '98', '5', 'GLND');
INSERT INTO `sys_parameters` VALUES ('99', '特立尼达和多巴哥', 'Trinidad And Tobago', '99', '5', 'TLNDHDBG');
INSERT INTO `sys_parameters` VALUES ('100', '牙买加', 'Jamaica', '100', '5', 'YMJ');
INSERT INTO `sys_parameters` VALUES ('101', '巴哈马', 'Bahamas', '101', '5', 'BHM');
INSERT INTO `sys_parameters` VALUES ('102', '阿根廷', 'Argentina', '102', '5', 'AGT');
INSERT INTO `sys_parameters` VALUES ('103', '玻利维亚', 'Bolivia', '103', '5', 'BLWY');
INSERT INTO `sys_parameters` VALUES ('104', '巴西', 'Brazil', '104', '5', 'BX');
INSERT INTO `sys_parameters` VALUES ('105', '厄瓜多尔', 'Ecuador', '105', '5', 'EGDE');
INSERT INTO `sys_parameters` VALUES ('106', '哥伦比亚', 'Colombia', '106', '5', 'GLBY');
INSERT INTO `sys_parameters` VALUES ('107', '圭亚那', 'Guyana', '107', '5', 'GYN');
INSERT INTO `sys_parameters` VALUES ('108', '秘鲁', 'Peru', '108', '5', 'ML');
INSERT INTO `sys_parameters` VALUES ('109', '苏里南', 'Surinam', '109', '5', 'SLN');
INSERT INTO `sys_parameters` VALUES ('110', '圣卢西亚', 'Saint Lucia', '110', '5', 'SLXY');
INSERT INTO `sys_parameters` VALUES ('111', '乌拉圭', 'Uruguay', '111', '5', 'WLG');
INSERT INTO `sys_parameters` VALUES ('112', '委内瑞拉', 'Venezuela', '112', '5', 'WNRL');
INSERT INTO `sys_parameters` VALUES ('113', '智利', 'Chile', '113', '5', 'ZL');
INSERT INTO `sys_parameters` VALUES ('114', '阿尔及利亚', 'Algeria', '114', '5', 'AEJLY');
INSERT INTO `sys_parameters` VALUES ('115', '埃及', 'Egypt', '115', '5', 'AJ');
INSERT INTO `sys_parameters` VALUES ('116', '埃塞俄比亚', 'Ethiopia', '116', '5', 'ASEBY');
INSERT INTO `sys_parameters` VALUES ('117', '安哥拉', 'Angola', '117', '5', 'AGL');
INSERT INTO `sys_parameters` VALUES ('118', '贝宁', 'Benin', '118', '5', 'BN');
INSERT INTO `sys_parameters` VALUES ('119', '博茨瓦纳', 'Botswana', '119', '5', 'BCWN');
INSERT INTO `sys_parameters` VALUES ('120', '布基纳法索', 'Burkina Faso', '120', '5', 'BJNFS');
INSERT INTO `sys_parameters` VALUES ('121', '布隆迪', 'Burundi', '121', '5', 'BLD');
INSERT INTO `sys_parameters` VALUES ('122', '赤道几内亚', 'Equatorial Guinea', '122', '5', 'CDJNY');
INSERT INTO `sys_parameters` VALUES ('123', '多哥', 'Togo', '123', '5', 'DG');
INSERT INTO `sys_parameters` VALUES ('124', '厄立特里亚', 'Eritrea', '124', '5', 'ELTLY');
INSERT INTO `sys_parameters` VALUES ('125', '佛得角', 'Verde', '125', '5', 'FDJ');
INSERT INTO `sys_parameters` VALUES ('126', '冈比亚', 'Gambia', '126', '5', 'GBY');
INSERT INTO `sys_parameters` VALUES ('127', '刚果（布）', 'Congo', '127', '5', 'GG（B）');
INSERT INTO `sys_parameters` VALUES ('128', '刚果（金）', 'Congo Kinshasa', '128', '5', 'GG（J）');
INSERT INTO `sys_parameters` VALUES ('129', '吉布提', 'Djibouti', '129', '5', 'JBT');
INSERT INTO `sys_parameters` VALUES ('130', '几内亚', 'Guinea', '130', '5', 'JNY');
INSERT INTO `sys_parameters` VALUES ('131', '几内亚比绍', 'Guinea Bissau', '131', '5', 'JNYBS');
INSERT INTO `sys_parameters` VALUES ('132', '加蓬', 'Gabon', '132', '5', 'JP');
INSERT INTO `sys_parameters` VALUES ('133', '加纳', 'Ghana', '133', '5', 'JN');
INSERT INTO `sys_parameters` VALUES ('134', '津巴布韦', 'Zimbabwe', '134', '5', 'JBBW');
INSERT INTO `sys_parameters` VALUES ('135', '喀麦隆', 'Cameroon', '135', '5', 'KML');
INSERT INTO `sys_parameters` VALUES ('136', '科摩罗', 'Comoros', '136', '5', 'KML');
INSERT INTO `sys_parameters` VALUES ('137', '科特迪瓦', 'Cote D Lvoire', '137', '5', 'KTDW');
INSERT INTO `sys_parameters` VALUES ('138', '肯尼亚', 'Kenya', '138', '5', 'KNY');
INSERT INTO `sys_parameters` VALUES ('139', '莱索托', 'Lesotho', '139', '5', 'LST');
INSERT INTO `sys_parameters` VALUES ('140', '利比里亚', 'Liberia', '140', '5', 'LBLY');
INSERT INTO `sys_parameters` VALUES ('141', '利比亚', 'Libya', '141', '5', 'LBY');
INSERT INTO `sys_parameters` VALUES ('142', '卢旺达', 'Rwanda', '142', '5', 'LWD');
INSERT INTO `sys_parameters` VALUES ('143', '马达加斯加', 'Madagascar', '143', '5', 'MDJSJ');
INSERT INTO `sys_parameters` VALUES ('144', '马里', 'Mali', '144', '5', 'ML');
INSERT INTO `sys_parameters` VALUES ('145', '毛里求斯', 'Mauritius', '145', '5', 'MLQS');
INSERT INTO `sys_parameters` VALUES ('146', '毛里塔尼亚', 'Mauritania', '146', '5', 'MLTNY');
INSERT INTO `sys_parameters` VALUES ('147', '摩洛哥', 'Morocco', '147', '5', 'MLG');
INSERT INTO `sys_parameters` VALUES ('148', '莫桑比克', 'Mozambique', '148', '5', 'MSBK');
INSERT INTO `sys_parameters` VALUES ('149', '纳米比亚', 'Namibia', '149', '5', 'NMBY');
INSERT INTO `sys_parameters` VALUES ('150', '南非', 'South Africa', '150', '5', 'NF');
INSERT INTO `sys_parameters` VALUES ('151', '尼日尔', 'Niger', '151', '5', 'NRE');
INSERT INTO `sys_parameters` VALUES ('152', '尼日利亚', 'Nigeria', '152', '5', 'NRLY');
INSERT INTO `sys_parameters` VALUES ('153', '塞拉利昂', 'Sierra Leone', '153', '5', 'SLLA');
INSERT INTO `sys_parameters` VALUES ('154', '塞内加尔', 'Senegal', '154', '5', 'SNJE');
INSERT INTO `sys_parameters` VALUES ('155', '塞舌尔', 'Seychelles', '155', '5', 'SSE');
INSERT INTO `sys_parameters` VALUES ('156', '圣多美和普林西比', 'Sao Tome Principe', '156', '5', 'SDMHPLXB');
INSERT INTO `sys_parameters` VALUES ('157', '苏丹', 'Sudan', '157', '5', 'SD');
INSERT INTO `sys_parameters` VALUES ('158', '索马里', 'Somali', '158', '5', 'SML');
INSERT INTO `sys_parameters` VALUES ('159', '坦桑尼亚', 'Tanzania', '159', '5', 'TSNY');
INSERT INTO `sys_parameters` VALUES ('160', '突尼斯', 'Tunisia', '160', '5', 'TNS');
INSERT INTO `sys_parameters` VALUES ('161', '乌干达', 'Uganda', '161', '5', 'WGD');
INSERT INTO `sys_parameters` VALUES ('162', '赞比亚', 'Zambia', '162', '5', 'ZBY');
INSERT INTO `sys_parameters` VALUES ('163', '乍得', 'Chad', '163', '5', 'ZD');
INSERT INTO `sys_parameters` VALUES ('164', '中非', 'Central Africa', '164', '5', 'ZF');
INSERT INTO `sys_parameters` VALUES ('165', '澳大利亚', 'Australia', '165', '5', 'ADLY');
INSERT INTO `sys_parameters` VALUES ('166', '巴布亚新几内亚', 'Papua New Guinea', '166', '5', 'BBYXJNY');
INSERT INTO `sys_parameters` VALUES ('167', '斐济', 'Fiji', '167', '5', 'FJ');
INSERT INTO `sys_parameters` VALUES ('168', '库克群岛', 'Cook', '168', '5', 'KKQD');
INSERT INTO `sys_parameters` VALUES ('169', '美属萨摩亚', 'Samoa', '169', '5', 'MSSMY');
INSERT INTO `sys_parameters` VALUES ('170', '密克罗尼西亚联邦', 'Micronesia', '170', '5', 'MKLNXYLB');
INSERT INTO `sys_parameters` VALUES ('171', '瑙鲁', 'Nauru', '171', '5', 'NL');
INSERT INTO `sys_parameters` VALUES ('172', '汤加', 'Tonga', '172', '5', 'TJ');
INSERT INTO `sys_parameters` VALUES ('173', '瓦努阿图', 'Vanuatu', '173', '5', 'WNAT');
INSERT INTO `sys_parameters` VALUES ('174', '新西兰', 'New Zealand', '174', '5', 'XXL');
INSERT INTO `sys_parameters` VALUES ('175', '保链百万意外伤害互助计划', 'Inschain Million mutual aid program', '1', '6', null);
INSERT INTO `sys_parameters` VALUES ('178', '男', 'male', '1', '4', null);
INSERT INTO `sys_parameters` VALUES ('179', '女', 'famale', '2', '4', null);
INSERT INTO `sys_parameters` VALUES ('180', '本人', 'benren', '1', '7', null);
INSERT INTO `sys_parameters` VALUES ('181', '配偶', 'peiou', '2', '7', null);
INSERT INTO `sys_parameters` VALUES ('182', '父母', 'parents', '3', '7', null);
INSERT INTO `sys_parameters` VALUES ('183', '子女', 'child', '4', '7', null);
INSERT INTO `sys_parameters` VALUES ('184', '其他亲戚', 'other relative', '5', '7', null);
INSERT INTO `sys_parameters` VALUES ('185', '同事', 'Colleague', '6', '7', null);
INSERT INTO `sys_parameters` VALUES ('186', '朋友', 'Friend', '7', '7', null);
INSERT INTO `sys_parameters` VALUES ('187', '其他关系', 'other', '8', '7', null);
INSERT INTO `sys_parameters` VALUES ('188', '待支付', 'daizhifu', '1', '3', null);
INSERT INTO `sys_parameters` VALUES ('189', '已支付（正在写入区块链）', 'zhengzaixieru', '2', '3', null);
INSERT INTO `sys_parameters` VALUES ('190', '等待期', 'wait', '3', '3', null);
INSERT INTO `sys_parameters` VALUES ('191', '有效期', 'effective', '4', '3', null);
INSERT INTO `sys_parameters` VALUES ('192', '宽限期', 'grace', '5', '3', null);
INSERT INTO `sys_parameters` VALUES ('193', '超宽限期', 'over grace', '6', '3', null);
INSERT INTO `sys_parameters` VALUES ('194', '已退出', 'quit', '7', '3', null);
INSERT INTO `sys_parameters` VALUES ('195', '身份证', 'identity card', '1', '1', null);
INSERT INTO `sys_parameters` VALUES ('196', '护照', 'passport', '2', '1', 'IDENTIYF_PP');
INSERT INTO `sys_parameters` VALUES ('197', '居住证', 'Residence permit\n\n', '3', '1', null);
INSERT INTO `sys_parameters` VALUES ('198', '互助计划账户', 'mutual account', '1', '2', null);
INSERT INTO `sys_parameters` VALUES ('199', '我的优惠账户', 'personal account', '2', '2', null);
INSERT INTO `sys_parameters` VALUES ('200', '未婚', 'unmarried', '1', '8', null);
INSERT INTO `sys_parameters` VALUES ('201', '已婚', 'married', '2', '8', null);

-- ----------------------------
-- Table structure for user_register
-- ----------------------------
DROP TABLE IF EXISTS `user_register`;
CREATE TABLE `user_register` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `register_id` varchar(32) NOT NULL COMMENT 'uuid',
  `member` varchar(128) NOT NULL COMMENT '注册的邮箱',
  `passwd` varchar(128) NOT NULL COMMENT '会员密码',
  `create_date` datetime NOT NULL COMMENT '创建时间',
  `update_date` datetime DEFAULT NULL COMMENT '更新时间',
  `column1` varchar(128) DEFAULT NULL COMMENT '预留字段1',
  `invite_code` varchar(10) DEFAULT NULL COMMENT '邀请码',
  `inviter_code` varchar(10) DEFAULT NULL COMMENT '邀请人的邀请码',
  `name` varchar(64) DEFAULT NULL COMMENT '姓名',
  `sex` varchar(2) DEFAULT NULL COMMENT '性别',
  `birthday` datetime DEFAULT NULL COMMENT '出生日期',
  `phone` varchar(32) DEFAULT NULL COMMENT '手机号',
  `country` int(11) DEFAULT NULL COMMENT '国家',
  `identity_id` varchar(32) DEFAULT NULL COMMENT '身份证号',
  `address` varchar(128) DEFAULT NULL COMMENT '地址',
  `points` int(6) DEFAULT NULL COMMENT '积分',
  `college` varchar(64) DEFAULT NULL COMMENT '毕业院校',
  `profession` varchar(64) DEFAULT NULL COMMENT '职业',
  `marital_status` varchar(2) DEFAULT NULL COMMENT '婚姻状况',
  PRIMARY KEY (`id`,`register_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COMMENT='注册会员信息表';

-- ----------------------------
-- Records of user_register
-- ----------------------------


-- ----------------------------
-- Table structure for `discount_account_personal`
-- ----------------------------
DROP TABLE IF EXISTS `discount_account_personal`;
CREATE TABLE `discount_account_personal` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '会员id',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `account_valid_sum` float NOT NULL DEFAULT '0' COMMENT '赠送GETX总额（已生效）',
  `account_unvalid_sum` float NOT NULL DEFAULT '0' COMMENT '赠送GETX总额（待生效）',
  `points` float NOT NULL DEFAULT '0' COMMENT '积分总额',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '状态, 1正常，2，锁定',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `update_date` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='个人优惠账户表';

-- ----------------------------
-- Records of discount_account_personal
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_activityRule`
-- ----------------------------
DROP TABLE IF EXISTS `discount_activityRule`;
CREATE TABLE `discount_activityRule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `activity_name` varchar(64) NOT NULL COMMENT '活动名称',
  `single_limit` int(11) NOT NULL DEFAULT '100000' COMMENT '单人获得GETX（积分）的上限',
  `single_reward` int(11) NOT NULL DEFAULT '0' COMMENT '赠送的GETX数量（或积分）',
  `total_reward` int(11) NOT NULL DEFAULT '1000000' COMMENT '赠送的GETX总的数量（或总的积分）',
  `a_start_time` datetime NOT NULL DEFAULT '2018-03-01 00:00:00' COMMENT '活动开始时间',
  `a_end_time` datetime NOT NULL DEFAULT '2019-03-01 00:00:00' COMMENT '活动结束时间',
  `product_ids` varchar(512) DEFAULT NULL COMMENT '可用于使用的产品的id，用特殊符（||）连接（最多7个）, *代表所有',
  `activity_rule` varchar(1024) DEFAULT NULL COMMENT '活动规则',
  `effect_time` datetime DEFAULT NULL COMMENT '赠送GETX/积分的使用期限（开始）',
  `dead_time` datetime DEFAULT NULL COMMENT '赠送GETX/积分的使用期限（结束）',
  `isWithdraw` int(11) NOT NULL DEFAULT '2' COMMENT 'GETX能否提现 1：能，2：不能',
  `account_type` int(11) NOT NULL DEFAULT '1' COMMENT '1:GETX; 2:积分',
  `sent_reward` int(11) NOT NULL DEFAULT '0' COMMENT '已经赠送的GETX总的数量（或总的积分）',
  PRIMARY KEY (`id`,`activity_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='活动规则表';

-- ----------------------------
-- Records of discount_activityRule
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_couponRule`
-- ----------------------------
DROP TABLE IF EXISTS `discount_couponRule`;
CREATE TABLE `discount_couponRule` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `discount_id` varchar(64) NOT NULL COMMENT '优惠券ID',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `activity_name` varchar(64) NOT NULL COMMENT '活动名称',
  `discount_name` varchar(64) NOT NULL COMMENT '优惠券名称',
  `discount_count` int(11) DEFAULT NULL COMMENT '赠送的优惠券的总的数量',
  `a_start_time` datetime DEFAULT NULL COMMENT '活动开始时间',
  `a_end_time` datetime DEFAULT NULL COMMENT '活动结束时间',
  `activity_rule` varchar(1024) DEFAULT NULL COMMENT '活动规则',
  `cdescribe` varchar(1024) DEFAULT NULL COMMENT '优惠券的描述信息（具体描述）',
  `product_ids` varchar(512) DEFAULT NULL COMMENT '可用于使用的产品的id，用特殊符（||）连接（最多7个）, *代表所有',
  `effect_time` datetime DEFAULT NULL COMMENT '优惠券的使用期限（开始）',
  `dead_time` datetime DEFAULT NULL COMMENT '优惠券的使用期限（结束）',
  PRIMARY KEY (`id`,`discount_id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='赠送优惠券活动规则表';

-- ----------------------------
-- Records of discount_couponRule
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_expense_log`
-- ----------------------------
DROP TABLE IF EXISTS `discount_expense_log`;
CREATE TABLE `discount_expense_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '会员id',
  `product_id` varchar(64) DEFAULT NULL COMMENT '产品id',
  `insurance_id` varchar(64) DEFAULT NULL COMMENT '保单ID',
  `expense_type` int(11) DEFAULT NULL COMMENT '消费类型，1、赠送的getx，2、积分，3、优惠券',
  `expense_count` float DEFAULT NULL COMMENT '消费的数量（优惠券不用填）',
  `discount_id` varchar(64) DEFAULT NULL COMMENT '优惠券ID（只有优惠券填）',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='消费优惠记录表';

-- ----------------------------
-- Records of discount_expense_log
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_getDiscount_log`
-- ----------------------------
DROP TABLE IF EXISTS `discount_getDiscount_log`;
CREATE TABLE `discount_getDiscount_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` varchar(64) NOT NULL COMMENT '会员id',
  `account_type` int(11) DEFAULT NULL COMMENT '优惠类型，1;赠送的getx，2、积分，3、优惠券',
  `get_count` float DEFAULT NULL COMMENT '获得的数量（优惠券不用填）',
  `create_date` datetime DEFAULT NULL COMMENT '创建时间',
  `discount_id` varchar(64) DEFAULT NULL COMMENT '优惠券ID（只有优惠券填）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='获得优惠记录表';

-- ----------------------------
-- Records of discount_getDiscount_log
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_inviterLog`
-- ----------------------------
DROP TABLE IF EXISTS `discount_inviterLog`;
CREATE TABLE `discount_inviterLog` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `inviter_id` varchar(64) NOT NULL COMMENT '邀请人ID',
  `invitee_id` varchar(64) NOT NULL COMMENT '被邀请人ID',
  `valid_status` int(11) NOT NULL COMMENT '该记录是否有效（被邀请人是否支付），1：有效，2：无效',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='邀请人和被邀请人的活动记录';

-- ----------------------------
-- Records of discount_inviterLog
-- ----------------------------

-- ----------------------------
-- Table structure for `discount_personal_info`
-- ----------------------------
DROP TABLE IF EXISTS `discount_personal_info`;
CREATE TABLE `discount_personal_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户的ID',
  `discount_id` varchar(64) NOT NULL COMMENT '活动ID',
  `is_valid` int(11) NOT NULL COMMENT '是否使用（1：未使用，2：已使用，3：已过期）（过期如何设置---在使用时进行查询）',
  `from_way` int(11) DEFAULT NULL COMMENT '获得来源（1：邀请注册，2：系统赠送）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='个人优惠账号的使用日志表';

-- ----------------------------
-- Records of discount_personal_info
-- ----------------------------

-- ----------------------------
-- Table structure for blockdata
-- ----------------------------
DROP TABLE IF EXISTS `blockdata`;
CREATE TABLE `blockdata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8 COMMENT='区块链查询名单表';

-- ----------------------------
-- Records of blockdata
-- ----------------------------
INSERT INTO `blockdata` VALUES ('1', 'Derek Black');
INSERT INTO `blockdata` VALUES ('2', 'wangxueyang');
INSERT INTO `blockdata` VALUES ('3', 'Tony Ren');
INSERT INTO `blockdata` VALUES ('4', 'YIM CHAIWA');
INSERT INTO `blockdata` VALUES ('5', 'Peter Art Salanatin');
INSERT INTO `blockdata` VALUES ('6', 'Peter Salanatin');
INSERT INTO `blockdata` VALUES ('7', 'Peter Domingo Salanatin');
INSERT INTO `blockdata` VALUES ('8', 'ziga');
INSERT INTO `blockdata` VALUES ('9', 'Kjeld Schigt');
INSERT INTO `blockdata` VALUES ('10', 'Roald Schigt');
INSERT INTO `blockdata` VALUES ('11', 'Nguyen Xuan Huynh');
INSERT INTO `blockdata` VALUES ('12', 'Ko Jie Ming');
INSERT INTO `blockdata` VALUES ('13', 'Nguyen Huu Tin');
INSERT INTO `blockdata` VALUES ('14', 'NGUYEN VAN TIEN');
INSERT INTO `blockdata` VALUES ('15', 'Bui Quoc Huy');
INSERT INTO `blockdata` VALUES ('16', 'MAI DUC KHAI');
INSERT INTO `blockdata` VALUES ('17', 'bryn heath');
INSERT INTO `blockdata` VALUES ('18', 'Nguyen Tien Dung');
INSERT INTO `blockdata` VALUES ('19', 'chanh');
INSERT INTO `blockdata` VALUES ('20', 'Duong Cong Nghiem');
INSERT INTO `blockdata` VALUES ('21', 'Pham van dong');
INSERT INTO `blockdata` VALUES ('22', 'La Phan Son Anh');
INSERT INTO `blockdata` VALUES ('23', 'HUNG PHAN VIET');
INSERT INTO `blockdata` VALUES ('24', 'Dang');
INSERT INTO `blockdata` VALUES ('25', 'Le Hoang Giang');
INSERT INTO `blockdata` VALUES ('26', 'Dung');
INSERT INTO `blockdata` VALUES ('27', 'Phan Thanh Tung');
INSERT INTO `blockdata` VALUES ('28', 'Pham Son Tung');
INSERT INTO `blockdata` VALUES ('29', 'Hai Bui');
INSERT INTO `blockdata` VALUES ('30', 'Hoang Phung Duc');
INSERT INTO `blockdata` VALUES ('31', 'Ngo Van Tung');
INSERT INTO `blockdata` VALUES ('32', 'Ho Quoc Viet');
INSERT INTO `blockdata` VALUES ('33', 'hieulan');
INSERT INTO `blockdata` VALUES ('34', 'Sascha Majewsky');
INSERT INTO `blockdata` VALUES ('35', 'Mai Nhu Cuong');
INSERT INTO `blockdata` VALUES ('36', 'van ton');
INSERT INTO `blockdata` VALUES ('37', 'hung');
INSERT INTO `blockdata` VALUES ('38', 'Phung Thai Hoc');
INSERT INTO `blockdata` VALUES ('39', 'Dinh Hai');
INSERT INTO `blockdata` VALUES ('40', 'Yong Zhien Choong');
INSERT INTO `blockdata` VALUES ('41', 'Quyet Johnny');
INSERT INTO `blockdata` VALUES ('42', 'Lan');
INSERT INTO `blockdata` VALUES ('43', 'Le Duc Huy');
INSERT INTO `blockdata` VALUES ('44', 'Nguyen Vuong Vinh Quang');
INSERT INTO `blockdata` VALUES ('45', 'Nguyen Viet Duc');
INSERT INTO `blockdata` VALUES ('46', 'Hung');
INSERT INTO `blockdata` VALUES ('47', 'The Nhu');
INSERT INTO `blockdata` VALUES ('48', 'HAI');
INSERT INTO `blockdata` VALUES ('49', 'Hiep Hoang Minh');
INSERT INTO `blockdata` VALUES ('50', 'Cao Thien Phuc');
INSERT INTO `blockdata` VALUES ('51', 'Tuan Bk');
INSERT INTO `blockdata` VALUES ('52', 'CUONG');
INSERT INTO `blockdata` VALUES ('53', 'Tran Tu Anh');
INSERT INTO `blockdata` VALUES ('54', 'NGA');
INSERT INTO `blockdata` VALUES ('55', 'quachminh');
INSERT INTO `blockdata` VALUES ('56', 'Phan quoc loi');
INSERT INTO `blockdata` VALUES ('57', 'Nguyen thi Quynh Anh');
INSERT INTO `blockdata` VALUES ('58', 'jakson leow');
INSERT INTO `blockdata` VALUES ('59', 'Tan Liu Sheng');
INSERT INTO `blockdata` VALUES ('60', 'Thien Hung Le');
INSERT INTO `blockdata` VALUES ('61', 'Minh Anh Nguyen');
INSERT INTO `blockdata` VALUES ('62', 'Lia Vydria');
INSERT INTO `blockdata` VALUES ('63', 'vbtuan');
INSERT INTO `blockdata` VALUES ('64', 'Le Van Tan');
INSERT INTO `blockdata` VALUES ('65', 'tran tuan anh');
INSERT INTO `blockdata` VALUES ('66', 'Byron Gerard Cadungog');
INSERT INTO `blockdata` VALUES ('67', 'tuan');
INSERT INTO `blockdata` VALUES ('68', 'Nghi Bao Nguyen HuynH');
INSERT INTO `blockdata` VALUES ('69', 'Jonathan Herson');
INSERT INTO `blockdata` VALUES ('70', 'Ho&agrave;ng');
INSERT INTO `blockdata` VALUES ('71', 'LIEW YONG QUAN TIMOTHY');
INSERT INTO `blockdata` VALUES ('72', 'HuynhTuanKien');
INSERT INTO `blockdata` VALUES ('73', 'Ho&agrave;ng Minh Đức');
INSERT INTO `blockdata` VALUES ('74', 'Minh Hieu Giap');
INSERT INTO `blockdata` VALUES ('75', 'Do Van Son');
INSERT INTO `blockdata` VALUES ('76', 'Ho&agrave;ng Minh Đức');
INSERT INTO `blockdata` VALUES ('77', 'Le Nhat Minh');
INSERT INTO `blockdata` VALUES ('78', 'Nguyen Chi Quy');
INSERT INTO `blockdata` VALUES ('79', 'nttungtq');
INSERT INTO `blockdata` VALUES ('80', 'Phan Thai Hieu');
INSERT INTO `blockdata` VALUES ('81', 'An');
INSERT INTO `blockdata` VALUES ('82', 'THUAN TRAN MINH');
INSERT INTO `blockdata` VALUES ('83', 'Christian Mischler');
INSERT INTO `blockdata` VALUES ('84', 'Tai');
INSERT INTO `blockdata` VALUES ('85', 'Le Anh TUan');
INSERT INTO `blockdata` VALUES ('86', 'Duy');
INSERT INTO `blockdata` VALUES ('87', 'Tran Duc Muoi');
INSERT INTO `blockdata` VALUES ('88', 'Andrew Schaer');
INSERT INTO `blockdata` VALUES ('89', 'Do Thi Trang');
INSERT INTO `blockdata` VALUES ('90', 'Nguyen Van Duc');
INSERT INTO `blockdata` VALUES ('91', '徐晓雪');
INSERT INTO `blockdata` VALUES ('92', '王书音');
INSERT INTO `blockdata` VALUES ('93', '吴沐阳');
INSERT INTO `blockdata` VALUES ('94', 'Matthias Tan');
INSERT INTO `blockdata` VALUES ('95', 'Jonathan Ng Qiao En');
INSERT INTO `blockdata` VALUES ('96', 'eric');
INSERT INTO `blockdata` VALUES ('97', 'eric');
INSERT INTO `blockdata` VALUES ('98', '赖旭锐');
INSERT INTO `blockdata` VALUES ('99', '董伯慧');
INSERT INTO `blockdata` VALUES ('100', '李亚红');
INSERT INTO `blockdata` VALUES ('101', '赵洋');
INSERT INTO `blockdata` VALUES ('102', 'Grizz');
INSERT INTO `blockdata` VALUES ('103', 'jdjdjd');
INSERT INTO `blockdata` VALUES ('104', '郭振华');
INSERT INTO `blockdata` VALUES ('105', 'eason');
INSERT INTO `blockdata` VALUES ('106', 'Jackie');
INSERT INTO `blockdata` VALUES ('107', 'Stella');
INSERT INTO `blockdata` VALUES ('108', 'Zidong Xu');
INSERT INTO `blockdata` VALUES ('109', 'Fanbing');
INSERT INTO `blockdata` VALUES ('110', 'Gino Roberto Wubben');
INSERT INTO `blockdata` VALUES ('111', '肖云亮');
INSERT INTO `blockdata` VALUES ('112', 'You Yewei');
INSERT INTO `blockdata` VALUES ('113', 'Penny');
INSERT INTO `blockdata` VALUES ('114', 'Li Xiaoyue');
INSERT INTO `blockdata` VALUES ('115', '缪琳');
INSERT INTO `blockdata` VALUES ('116', 'XY');
INSERT INTO `blockdata` VALUES ('117', 'Emmanuel Tolessa');
INSERT INTO `blockdata` VALUES ('118', 'kennethlv');
INSERT INTO `blockdata` VALUES ('119', 'Geonard');
INSERT INTO `blockdata` VALUES ('120', '一琛');


-- ----------------------------
-- Table structure for `discount_getx_log`
-- ----------------------------
DROP TABLE IF EXISTS `discount_getx_log`;
CREATE TABLE `discount_getx_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `product_ids` varchar(512) NOT NULL DEFAULT '*' COMMENT '能够使用的产品ID们',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `effect_time` datetime DEFAULT NULL COMMENT '生效时间',
  `dead_time` datetime DEFAULT NULL COMMENT '失效时间',
  `isWithdraw` int(11) NOT NULL DEFAULT '1' COMMENT '是否使用，1：未使用，2使用过',
  `total_count` float DEFAULT NULL COMMENT '活动的single_reward',
  `invitee_id` varchar(64) NOT NULL COMMENT '被邀请人ID',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '是否激活（1：未激活，2：激活）',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COMMENT='活动赠送的优惠GETX的记录表';


-- ----------------------------
-- Table structure for `user_activity_log`
-- ----------------------------
DROP TABLE IF EXISTS `user_activity_log`;
CREATE TABLE `user_activity_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
  `activity_id` varchar(64) NOT NULL COMMENT '活动ID',
  `user_id` varchar(64) NOT NULL COMMENT '用户ID',
  `product_ids` varchar(512) NOT NULL COMMENT '产品的id们',
  `total_count` float NOT NULL DEFAULT '0' COMMENT '总数量',
  `used_count` float NOT NULL DEFAULT '0' COMMENT '使用的数量',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `effect_time` datetime NOT NULL COMMENT '生效时间',
  `dead_time` datetime NOT NULL COMMENT '过期时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COMMENT='个人-活动优惠GETX的记录表';

-- ----------------------------
-- Table structure for mutual_withdraw
-- ----------------------------
DROP TABLE IF EXISTS `mutual_withdraw`;
CREATE TABLE `mutual_withdraw` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `insurance_id` varchar(32) DEFAULT NULL COMMENT '保单id',
  `quit_reason` varchar(1024) DEFAULT NULL COMMENT '退出原因',
  `eth_address` varchar(32) DEFAULT NULL COMMENT 'eht地址',
  `stage` int(10) DEFAULT NULL COMMENT '退出状态',
  `register_id` varchar(32) DEFAULT NULL COMMENT '用户id',
  `quit_money` int(12) DEFAULT NULL COMMENT '退出金额',
  `create_date` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT '创建日期',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='退出计划';