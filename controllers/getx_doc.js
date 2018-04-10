exports.index = function (req, res, next) {
    var doc_id = req.query.doc_id;

    var lan = req.session.lan;
    if (doc_id ==2) {
        if(lan){
            res.render('doc/rule_en', {
                'name': 'doc1',
                'title': 'doc',
            });
            return
        }
        res.render('doc/rule', {
            'name': 'doc1',
            'title': 'doc',
        });
    }

    if (doc_id == 1) {
        if(lan){
            res.render('doc/healthy_notify_en', {
                'name': 'doc2',
                'title': 'doc',
            });
            return
        }
        res.render('doc/healthy_notify', {
            'name': 'doc2',
            'title': 'doc',
        });
    }

    if (doc_id == 3) {
        if(lan){
             res.render('doc/member_convention_en', {
                'name': 'doc3',
                'title': 'doc',
            });
            return
        }
        res.render('doc/member_convention', {
            'name': 'doc3',
            'title': 'doc',
        });
    }

    if (doc_id == 4) {
        if(lan){
            res.render('doc/user_agreement_en', {
                'name': 'user_agreement',
                'title': 'user_agreement',
            });
            return
        }
        res.render('doc/user_agreement', {
            'name': '用户注册协议',
            'title': '用户注册协议',
        });
    }

    if (doc_id == 5) {
        if(lan){
            res.render('doc/privacy_policy_en', {
                'name': 'privacy_policy',
                'title': 'privacy_policy',
            });
            return
        }
        res.render('doc/privacy_policy', {
            'name': '隐私条款',
            'title': '隐私条款',
        });
    }
    if (doc_id == 6) {
        if(lan){
            res.render('doc/condition_sales_en', {
                'name': 'GETX TOKEN - TERMS AND CONDITIONS OF TOKEN SALE AND USAGE',
                'title': 'GETX TOKEN - TERMS AND CONDITIONS OF TOKEN SALE AND USAGE',
            });
            return
        }
        res.render('doc/condition_sales', {
            'name': '关于GETX的使用协议',
            'title': '关于GETX的使用协议',
        });
    }
};