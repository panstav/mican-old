'use strict';

var emailRegExp = require('./email-regexp');

var common = {
	title: 'מכאן',
	site: { name: 'Mican.co.il', lang: 'he_IL' },
	description: 'אינדקס יוזמות חברתיות. הגיע הזמן להתארגן ברשת!',
	logo: { square: 'https://s3.eu-central-1.amazonaws.com/mican/logo/logo-square.jpg' },
	twitter: { card: 'summary', creator: '@stavgeffen' },
	author: 'Stav Geffen',

	domain: getDomain(),

	timeformat: 'DD/MM/YYYY HH:mm',

	emailRegExp
};

module.exports = common;

function getDomain(){

	let domain = 'http';
	if (process.env.SECURE) domain += 's';
	domain += '://';

	if (process.env.LOCAL){
		domain += 'localhost:3000';

	} else if (process.env.NODE_ENV === 'development'){
		domain += 'micanco.herokuapp.com';

	} else if (process.env.NODE_ENV === 'production'){
		domain += 'www.mican.co.il';
	}

	return domain;
}