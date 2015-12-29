var log = require('../../../services/log');

var auth = require('../../../middleware/auth');
var validate = require('express-validation');
var validation = require('../validation.js').users;

module.exports = function(router){

	router.patch(
		'/initials',
		auth(),
		validate(validation.patchInitials),
		require('./initials')
	);

	router.get(
		'/send-confirmation-email',
		auth(),
		require('./send-confirmation-email')
	);

	router.get(
		'/new-faces',
		auth({ admin: true }),
		require('./new-faces')
	);

	router.get(
		'/logout',
		function(req, res){
			log.debug({ userID: req.user._id }, 'User Logged Out');

			req.logout();

			res.status(200).end();
		}
	);
};