var db =      require('../../../services/db');

var auth =    require('../../../middleware/auth');
var admin =   auth({ admin: true });

var urls =    require('../../../helpers/urls');

module.exports = function(router){

	router.get('/regenerate-sitemap', admin, function(req, res, next){

		db.regenerateSitemap(function(err){
			if (err) return next(err);

			res.status(200).end();
		});

	});

};