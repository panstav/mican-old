var passport = require('passport');

module.exports = function(router){

	router.get(
		'/auth',
		passport.authenticate('facebook', { scope: ['public_profile', 'email'], display: 'popup' })
	);

	router.get(
		'/callback',
		passport.authenticate('facebook', { successRedirect: '/', failureRedirect: '/login' })
	);

};