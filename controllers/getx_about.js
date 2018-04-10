exports.index = function (req, res, next) {

	var lan=req.session.lan
	if(lan){
		res.render('about/about_en',{
			'name':'about',
			'title':'about us'
		});
		return
	}
	res.render('about/about',{
		'name':'about',
		'title':'关于我们'
	});
};