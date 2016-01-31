var mongoose =  require('mongoose');

module.exports = (req, res, next) => {

	var userModel = mongoose.model('user');

	var query = { email: process.env.MOCK_USER };

	userModel.findOne(query, (err, localUserDoc) => {
		if (err) return next(err);

		// simply populate req.user with this account
		req.user = localUserDoc.toObject();

		next();
	});
};