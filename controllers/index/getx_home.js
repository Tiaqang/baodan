var mysql = require('./../../db');

exports.index = function (req, res, next) {

    // query banner
    var query_banner = 'SELECT * FROM  xxx';
    var query_sql = 'SELECT * FROM mutual_param';

    var lan=req.session.lan

    
    if(lan){
        console.log(1)
        res.render('home_en',{
           'name':'home',
           'title':'home',
        });
        return;
    }
    res.render('home',{
       'name':'home',
       'title':'保链互助'
    });
};
