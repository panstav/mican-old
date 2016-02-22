'use strict';

const expect = require('expect.js');
const request = require('supertest');
const async = require('async');

const db = require('../server/services/db');
const validMongoID = require('../server/helpers/valid-mongo-id');

var express;

const mockUserEmail = 'fakeuser@mican.co.il';
const testGroupDisplayName = 'user-test-group-display-name';

describe('User', () => {

	before(done => {

		// define test env
		process.env.NODE_ENV = 'test';

		let userObj = {
			email: mockUserEmail
		};

		db.models.user.create(userObj, err => {
			if (err) done(err);

			process.env.MOCK_USER = mockUserEmail;

			express = require('../server').init();

			done();
		});

	});

	describe('Admin API', () => {

		describe('POST /group-authorize', () => {

			it('Should respond with 401 to an empty request', done => {

				request(express)
					.post('/api/admin/group-authorize')
					.end((err, res) => {
						if (err) done(err);

						expect(res.status).to.eql(401);

						done();
					});

			});

			it('Should respond with 401 to a correct request as well', done => {

				request(express)
					.post('/api/admin/group-authorize')
					.send({ groupId: validMongoID.gen() })
					.end((err, res) => {
						if (err) done(err);

						expect(res.status).to.eql(401);

						done();
					});

			});

		});

		describe('POST /group-category', () => {

			it('Should respond with 401 to a correct request', done => {

				request(express)
					.put('/api/admin/group-category')
					.end((err, res) => {
						if (err) done(err);

						expect(res.status).to.eql(401);

						done();
					});

			});

		});

	});

	describe('Groups API', () => {

		describe('POST \'/\' - Add Group', () => {

			it('Should flag newly created group with pending flag', done => {

				const newGroupObj = {
					displayName: testGroupDisplayName,
					desc: 'desc',
					color: 'sky',
					amAdmin: true
				};

				request(express)
					.post('/api/groups/')
					.send(newGroupObj)
					.end((err, res) => {
						if (err) return done(err);

						expect(res.status).to.be.eql(200);
						expect(res.body.groupCreated).to.be.ok();
						expect(res.body._id).to.be.ok();

						const newlyCreatedGroupId = res.body._id;

						expect(validMongoID(newlyCreatedGroupId)).to.be.ok();

						db.models.group.findById(newlyCreatedGroupId).exec()
							.then(checkPending, done);

						function checkPending(groupDoc){
							expect(groupDoc.pending).to.be.eql(true);

							done();
						}

					});

			});

		});

	});

	after(done => {

		// close express instance
		express.listen().close();

		delete process.env.MOCK_USER;

		let tasks = [ delete_test_group, delete_test_user ];

		async.parallel(tasks, done);

		function delete_test_group(done){
			db.models.group.remove({ displayName: testGroupDisplayName }, done);
		}

		function delete_test_user(){
			db.models.user.remove({ email: mockUserEmail }, done);
		}
	});

});