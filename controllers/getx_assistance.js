exports.index = function (req, res, next) {

	var lan = req.session.lan;
	if(lan){
		res.render('assistance/assistance_en',{
			'name':'personal',
			'title':'Help'
		});
		return
	}
	res.render('assistance/assistance',{
		'name':'personal',
		'title':'帮助中心'
	});
};