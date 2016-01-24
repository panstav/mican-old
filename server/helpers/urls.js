module.exports = {

	domain: domain(),

	anonAvatar:
		'https://s3.eu-central-1.amazonaws.com/mican/misc/anon-avatar.png',

	officialAddress: 'admin@mican.co.il',
	supportAddress: 'admin@mican.co.il'

};

function domain(){
	if (process.env.LOCAL) return 'http://localhost:3000';

	var domain = 'http';
	if (process.env.SECURE) domain += 's';
	domain += '://';

	if (process.env.NODE_ENV === 'production') return domain + 'www.mican.co.il';

	return domain + 'www.mican.co.il';
}