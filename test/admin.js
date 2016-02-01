'use strict';

var expect = require('expect.js');
var request = require('supertest');
var _ = require('lodash');

var db = require('../server/services/db');

var express, mockUserEmail = 'fakeadmin@mican.co.il';

before(done => {

	// define test env
	process.env.NODE_ENV = 'test';

	let adminObj = {
		email: mockUserEmail,
		roles: ['admin']
	};

	// create a mock user
	db.models.user.create(adminObj, err => {
		if (err) done(err);

		process.env.MOCK_USER = mockUserEmail;

		express = require('../server').init();

		done();
	});
});

describe('Groups API', () => {

	describe('POST \'/\' - Add Group', () => {

		var requiredFields;

		it('Shouldn\'t allow creating a group without required data', done => {

			request(express)
				.post('/api/groups/')
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(400);

					let errors = _.get(res, 'body.errors');
					expect(errors).to.be.an('array');
					expect(errors.length).to.above(0);

					// filter to only error of required field
					let errorsByMissingData = errors.filter(errorField => errorField.messages[0] === `${errorField.field} is required`);
					expect(errorsByMissingData.length).to.above(0);

					// bubble up the missing fields for testing a valid add-group request
					requiredFields = errorsByMissingData.map(error => error.field);

					done();
				});

		});

	});

});

after(done => {

	// delete test user
	db.models.user.remove({ email: mockUserEmail }, err => {
		if (err) done(err);

		// close express instance
		express.listen().close();
		
		done();
	});
});