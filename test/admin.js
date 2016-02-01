'use strict';

var expect = require('expect.js');
var request = require('supertest');
var _ = require('lodash');
var async = require('async');

var db = require('../server/services/db');
var validMongoID = require('../server/helpers/valid-mongo-id');

var express;

var mockUserEmail = 'fakeadmin@mican.co.il';
var testGroupDisplayName = 'test-group-display-name';

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

describe('Admin - Groups API', () => {

	describe('POST \'/\' - Add Group', () => {

		var validColor;

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

					done();
				});

		});

		it('Shouldn\'t allow creating a group with non-existent color', done => {

			let newGroupObj = {
				displayName: testGroupDisplayName,
				desc: 'desc',
				color: 'non-existent'
			};

			request(express)
				.post('/api/groups/')
				.send(newGroupObj)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.status).to.be.eql(400);

					let error = _.get(res, 'body.errors[0]');
					expect(error).to.be.an('object');
					expect(error.field).to.be.eql('color');

					let errorMessage = _.get(error, 'messages[0]');
					expect(/^color must be one of /.test(errorMessage)).to.be.ok();

					// remember the first valid color
					validColor = errorMessage.substr(21, errorMessage.indexOf(',') -21);

					done();
				});

		});

		it('Should allow creating a group with minimal properties', done => {

			let newGroupObj = {
				displayName: testGroupDisplayName,
				desc: 'desc',
				color: validColor
			};

			request(express)
				.post('/api/groups/')
				.send(newGroupObj)
				.end((err, res) => {
					if (err) return done(err);

					expect(res.status).to.be.eql(200);
					expect(res.body.groupCreated).to.be.ok();

					expect(res.body._id).to.not.be.ok();

					// try again with the amAdmin flag on
					newGroupObj.amAdmin = true;
					request(express)
						.post('/api/groups/')
						.send(newGroupObj)
						.end((err, res) => {
							if (err) return done(err);

							expect(res.status).to.be.eql(200);
							expect(res.body.groupCreated).to.be.ok();

							// this time an id of the newly created group should be available
							expect(res.body._id).to.be.ok();
							let validNewGroupID = validMongoID(res.body._id);
							expect(validNewGroupID).to.be.ok();

							done();
						});

				});

		});

	});

});

after(done => {

	// close express instance
	express.listen().close();

	let tasks = [ delete_test_group, delete_test_admin_user ];

	async.parallel(tasks, done);

	function delete_test_group(done){
		db.models.group.remove({ displayName: testGroupDisplayName }, done);
	}

	function delete_test_admin_user(){
		db.models.user.remove({ email: mockUserEmail }, done);
	}
});