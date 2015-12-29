var passport = require('passport');

module.exports = function(router){

	router.get(
		'/auth',
		passport.authenticate('google', { scope: 'profile email' })
	);

	router.get(
		'/callback',
		passport.authenticate('google', { successRedirect: '/', failureRedirect: '/login' })
	);

};