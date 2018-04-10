/*$.post('/islogin',{},function(stage){
    console.log(stage);

    if(stage.stage){
      // toast('登录成功');
      //存储用户信息至session
      // setSessionStorage('user_email',rescnt.result_msg.member);
      // setSessionStorage('user_password',rescnt.result_msg.password);

      //更改用户状态
      $('li.login').hide();
      $('.user_name').html(stage.stage);
      $('.personal_info').show();
      $('.login_box').hide();

    }
})*/
$('.personal a').click(function(e){

     var _this = $(this);
             var subHref = _this.attr('href');
             console.log(subHref);
             e.preventDefault();           
             

             $.post('/islogin',{},function(stage){
    console.log(stage);

    if(stage.stage){
      // toast('登录成功');
      //存储用户信息至session
      // setSessionStorage('user_email',rescnt.result_msg.member);
      // setSessionStorage('user_password',rescnt.result_msg.password);

      //更改用户状态
      /*$('li.login').hide();
      $('.user_name').html(stage.stage);
      $('.personal_info').show();
      $('.login_box').hide();*/
       window.location.href=subHref;

    }else{

      toast('请先登录~')
    }
})



  
})