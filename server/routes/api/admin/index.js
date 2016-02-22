const validate =    require('express-validation');

const db =          require('../../../services/db');

const auth =        require('../../../middleware/auth');
const admin =       auth({ admin: true });

const validation =  require('../validation.js');

module.exports = function(router){

	/*
	 * Get api/regenerate-sitemap - regenerates sitemap and returns
	 */

	router.get('/regenerate-sitemap', admin, function(req, res, next){

		db.regenerateSitemap(function(err){
			if (err) return next(err);

			res.status(200).end();
		});

	});

	/*
	 * Post api/group-authorize - Authorizes a new group to general publicity
	 */

	router.post('/group-authorize', admin, validate(validation.groups.admin.authorize), (req, res, next) => {

		db.models.group.findByIdAndUpdate(req.body.groupId, { pending: false }).exec()
			.then(() => { res.status(200).end(); }, next);

	});

	/*
	 * Put api/admin/group-category   - updates category
	 * Put api/admin/group-namespace  - updates namespace
	 * Put api/admin/group-authorize  - updates pending to false
	 */

	router.put('/group-category', admin, validate(validation.groups.admin.setCategory), (req, res, next) => {

		const update = { color: req.body.newCategory };

		db.models.group.findByIdAndUpdate(req.body.groupId, update).exec()
			.then(() => { res.status(200).end(); }, next);

	});

	router.put('/group-namespace', admin, validate(validation.groups.admin.setNamespace), (req, res, next) => {

		const namespace = req.body.newNamespace;

		const dashCasedName = namespace.toLowerCase().match(/^[a-z-0-9]+$/);
		if (!dashCasedName) return res.status(400).end();

		db.models.group.findByIdAndUpdate(req.body.groupId, { namespace: dashCasedName }).exec()
			.then(() => { res.status(200).end(); }, next);

	});

};