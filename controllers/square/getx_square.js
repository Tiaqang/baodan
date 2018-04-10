
exports.index = function (req, res, next) {

	var lan =req.session.lan

	if(lan){
		res.render('square/square_en',{
			'name':'square',
			'title':'Square',
		});
		return
	}
	res.render('square/square',{
		'name':'square',
		'title':'广场',
	});
};
exports.news = function (req, res, next) {
	var lan =req.session.lan

	if(lan){
		res.render('square/news_en',{
			'name':'square',
			'title':'News',
		});
		return
	}

	res.render('square/news',{
		'name':'square',
		'title':'资讯',
	});
};
