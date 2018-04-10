exports.index = function (req, res, next) {
  var lan = req.session.lan;

  if(lan){
    res.render('publicity/index_en',{
      'name':'publicity',
      'title':'publicity'
    });

    return 
  }

  res.render('publicity/index',{
  	'name':'publicity',
  	'title':'互助公示'
  });
};

exports.details = function (req, res, next) {

  var lan = req.session.lan;
  var id = req.params.id;
  if(lan){
    res.render('publicity_details/publicity_details_en',{
      'name':'publicity',
      'title':'publicity'
    });

    return 
  }
  res.render('publicity_details/publicity_details',{
  	'name':'publicity',
  	'title':'互助公示'
  });
};

exports.publicity_each = function (req, res, next) {
  var lan = req.session.lan;
  if(lan){
    res.render('publicity_each/publicity_each_en',{
      'name':'publicity',
      'title':'publicity'
    });

    return 
  }
  res.render('publicity_each/publicity_each',{
  	'name':'publicity',
  	'title':'每期公示'
  });
};
exports.publicity_operations = function (req, res, next) {

  var lan = req.session.lan;
  if(lan){
    res.render('publicity/publicity_operations_en',{
      'name': 'publicity',
      'title': 'publicity_operations'
    })

    return 
  }
	res.render('publicity/publicity_operations',{
		'name': 'publicity',
		'title': '运营公示'
	})
}