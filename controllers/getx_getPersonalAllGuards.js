
exports.index = function (req, res, next) {

	var lan = req.session.lan
	if(lan){
		res.render('getPersonalAllGuards/getPersonalAllGuards_en',{
			'name':'My protection',
			'list':'123'
		});
		return
	}	
	res.render('getPersonalAllGuards/getPersonalAllGuards',{
		'name':'我的保障',
		'list':'123'
	});
};
