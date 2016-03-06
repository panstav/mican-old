'use strict';

const _ = require('lodash');
const validUrl = require('valid-url');
const encodeUrl = require('urlencode');

const hebrewChars = ['א','ב','ג','ד','ה','ו','ז','ח','ט','י','כ','ל','מ','נ','ס','ע','פ','צ','ק','ר','ש','ת','ן','ם','ך','ף','ץ'];

module.exports = links => {

	const validUrls = {};

	_.forIn(links, (originalUrl, propName) => {

		if (!originalUrl){
			validUrls[propName] = '';
			return;
		}

		const url = encodeHebrewChars(originalUrl);

		if (validUrl.isWebUri(url)) validUrls[propName] = originalUrl;
	});

	return validUrls;

};

function encodeHebrewChars(str){

	var validStr = '';

	for (let i = 0, len = str.length; i < len; i++){
		
		if (hebrewChars.indexOf(str[i]) > -1){
			validStr += encodeUrl(str[i]);
		} else {
			validStr += str[i];
		}
	}

	return validStr;
}