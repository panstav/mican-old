module.exports = {

	domain: domain(),

	anonAvatar:
		'https://s3.eu-central-1.amazonaws.com/darkenu/avatars/anon.png',

	officialAddress: 'darkenu.net@gmail.com',
	supportAddress: 'stavgeffen@gmail.com'

};

function domain(){
	if (process.env.LOCAL) return 'http://localhost:3000';

	var domain = 'http';
	if (process.env.SECURE) domain += 's';
	domain += '://';

	if (process.env.NODE_ENV === 'production') return domain + 'www.darkenu.net';

	return domain + 'darkenu-dev.herokuapp.com';
}