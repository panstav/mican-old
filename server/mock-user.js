var db = require('./services/db');

module.exports = (req, res, next) => {

	var query = { email: process.env.MOCK_USER };

	db.models.user.findOne(query, (err, localUserDoc) => {
		if (err) return next(err);

		// simply populate req.user with this account
		req.user = localUserDoc.toObject();

		next();
	});
};