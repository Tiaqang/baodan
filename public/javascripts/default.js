var screenWidth = window.screen.width;
var screenHeight = window.screen.height;
//pc端判定
function IsPC() {
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone",
                "SymbianOS", "Windows Phone",
                "iPad", "iPod"];
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
//判断元素是否隐藏
function ishidden(id) {
	return $('#' + id).is(":hidden");
}
//本地存储 封装
function setLocalStorage(key, value) {
	if(window.localStorage){
		localStorage.setItem(key, value);
	}
}
function getLocalStorage(key) {
	var value;
	if(window.localStorage){
		value = localStorage.getItem(key);
	}
	return value;
}
function setSessionStorage(key, value) {
	if(window.sessionStorage){
		sessionStorage.setItem(key, value);
	}
}
function getSessionStorage(key) {
	var value;
	if(window.sessionStorage){
		value = sessionStorage.getItem(key);
	}
	return value;
}
function removeLocalStorage(key) {
	if(window.localStorage){
		localStorage.removeItem(key);
	}
}
// ajax 封装
function back() {
	history.back();
}
//layer 弹出层
function toast(content) {
	layer.msg(content,{time: 3000});
}
function layer_cancel() {
	layer.closeAll();
}
function dialog(contenthtml, confirm, cancel, yes, no) {
	
	layer.open({
		content: contenthtml
	    ,btn: [confirm, cancel]
	    ,yes: function(index){
	    	yes(index);
	    }
	});
}
function confirm(contenthtml, confirm, yes) {
	
	layer.open({
	    content: contenthtml
	    ,btn: confirm
	    ,yes: function(index) {
	    	yes(index)
	    }
	  });
}

//生成图片验证码

/**生成一个随机数**/
function randomNum(min,max){
return Math.floor( Math.random()*(max-min)+min);
}

/**生成一个随机色**/
function randomColor(min,max){
var r = randomNum(min,max);
var g = randomNum(min,max);
var b = randomNum(min,max);
return "rgb("+r+","+g+","+b+")";
}

/**绘制验证码图片**/
function drawPic(text,canvas){

//var canvas=document.getElementById("canvas");
var width=canvas.width;
var height=canvas.height;
var ctx = canvas.getContext('2d');
ctx.textBaseline = 'bottom';

/**绘制背景色**/
//ctx.fillStyle = randomColor(200,240); //颜色若太深可能导致看不清
//ctx.fillRect(0,0,width,height);
/**绘制文字**/
//var str = 'ABCEFGHJKLMNPQRSTWXY123456789';


for(var i=0; i<text.length; i++){
  //var txt = str[randomNum(0,str.length)];
  var txt=text[i];
  ctx.fillStyle = randomColor(50,160);  //随机生成字体颜色
  ctx.font = randomNum(30,32)+'px SimHei'; //随机生成字体大小
  var x = 10+i*24;
  var y = randomNum(30,35);
  var deg = randomNum(-25, 25);
  //修改坐标原点和旋转角度
  ctx.translate(x,y);
  ctx.rotate(deg*Math.PI/180);
  ctx.fillText(txt, 0,0);
  //恢复坐标原点和旋转角度
  ctx.rotate(-deg*Math.PI/180);
  ctx.translate(-x,-y);
}
/**绘制干扰线**/
for(var i=0; i<2; i++){
  ctx.strokeStyle = randomColor(40,180);
  ctx.beginPath();
  ctx.moveTo( randomNum(0,width), randomNum(0,height) );
  ctx.lineTo( randomNum(0,width), randomNum(0,height) );
  ctx.stroke();
}
/**绘制干扰点**/
for(var i=0; i<20; i++){
  ctx.fillStyle = randomColor(0,255);
  ctx.beginPath();
  ctx.arc(randomNum(0,width),randomNum(0,height), 1, 0, 2*Math.PI);
  ctx.fill();
}
}