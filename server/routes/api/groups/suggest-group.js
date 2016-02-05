'use strict';

var extend = require('util')._extend;

var sendMail = require('../../../services/email');

var adminAddress = require('../../../helpers/urls').officialAddress;
var emailRegExp = require('../../../../common/email-regexp');

module.exports = (req, res) => {

	var contacts = req.body.contacts;

	// validation
	let error = validate(contacts);
	if (error) return res.status(400).json(error);

	// prep mail obj
	let suggestObj = { displayName: req.body.displayName };

	// add up all contact to suggestObj
	// from:  contact { type: 'link', value: 'http://www.example.com' }
	// to:    contact { web: 'http://www.example.com' }
	suggestObj = extend(suggestObj, contacts.reduce(toContactObject, {}));

	let mailObj = {
		subject:      'המלצה על יוזמה חדשה',
		recipient:    adminAddress,
		importance:   false,
		template:     'suggestGroup',
		templateArgs: suggestObj
	};

	sendMail(mailObj, err => {
		if (err) return next(err);

		res.status(200).end();
	});

	function validate(contacts){

		// validate web address, if given
		let webAddressess = contacts.filter(contact => contact.type === 'link');
		if (webAddressess.length){
			if (!webAddressess[0].value.match(/^(http:\/\/)|(https:\/\/)/)) return { invalidWebAddress: true };
		}

		// validate email, if given
		let emailAddresses = contacts.filter(contact => contact.type === 'mail');
		if (emailAddresses.length){
			if (!emailRegExp.test(emailAddresses[0].value)) return { invalidEmailAddress: true };
		}

	}

	function toContactObject(accumulator, contact){
		accumulator[contact.type] = contact.value;
		return accumulator;
	}

};

