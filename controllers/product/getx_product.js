var mysql = require('./../../db');

exports.index = function (req, res, next) {

  var mutual_param_id = req.query.program_id;
  var lan=req.session.lan
  //接受参数 产品id 根据id 查询产品相关信息并传回页面
  var query_byID = 'SELECT * FROM mutual_param WHERE id=' + mysql.escape(mutual_param_id);
  mysql.query(query_byID, function(err, rows, fields){
    if (err) {
      return next(err);
    }else {
      if(lan){
        res.render('product/index_en',{
          'title':'product',
          'name':'product',
          'rows':rows,
          'program_id':mutual_param_id
        });
        return
      }
      res.render('product/index',{
        'title':'互助产品',
      	'name':'product',
        'rows':rows,
        'program_id':mutual_param_id
      });
    }
  })

};
