'use strict';

var expect = require('expect.js');
var request = require('supertest');
var _ = require('lodash');
var async = require('async');

var db = require('../server/services/db');
var validMongoID = require('../server/helpers/valid-mongo-id');

var express;

var mockAdminEmail = 'fakeadmin@mican.co.il';
var testGroupDisplayName = 'admin-test-group-display-name';
var testGroupId;

describe('Admin', () => {

	before(done => {

		// define test env
		process.env.NODE_ENV = 'test';

		let adminObj = {
			email: mockAdminEmail,
			roles: ['admin']
		};

		createMockUser()
			.then(createMockGroup)
			.then(done, done);

		function createMockUser(){
			return new Promise((resolve, reject) => {

				// create a mock user
				db.models.user.create(adminObj, err => {
					if (err) reject(err);

					process.env.MOCK_USER = mockAdminEmail;

					express = require('../server').init();

					resolve();
				});

			});
		}

		function createMockGroup(){
			return new Promise((resolve, reject) => {

				// create a mock group
				db.models.group.create({ displayName: testGroupDisplayName }, (err, doc) => {
					if (err) reject(err);

					testGroupId = doc._id.toString();

					resolve();
				});

			});
		}

	});

	describe('Admin API', () => {

		describe('POST /group-authorize - Remove pending flag from group', () => {

			it('Should respond with 400 to an empty request', done => {

				request(express)
					.post('/api/admin/group-authorize')
					.end((err, res) => {
						if (err) done(err);

						expect(res.status).to.eql(400);
						expect(JSON.parse(res.text).errors.length).to.be.above(0);

						done();
					});

			});

			it('Should set pending property to false', done => {

				var pendingGroupId;
				const pendingGroupDisplayName = 'pending-group';

				db.models.group.create({ displayName: pendingGroupDisplayName })
					.then(pendingGroup => { pendingGroupId = pendingGroup._id; }, done)
					.then(testAuthorize)
					.then(makeSureGroupIsntPending)
					.then(removePendingGroup)
					.then(done);

				function testAuthorize(){
					return new Promise(resolve => {

						request(express)
							.post('/api/admin/group-authorize')
							.send({ groupId: pendingGroupId })
							.end((err, res) => {
								if (err) done(err);

								expect(res.status).to.eql(200);

								resolve();
							});

					});
				}

				function makeSureGroupIsntPending(){
					return new Promise(resolve => {

						request(express)
							.get(`/api/groups/${ pendingGroupId }`)
							.end((err, res) => {
								if (err) done(err);

								expect(res.status).to.eql(200);
								expect(res.body.displayName).to.be.eql(pendingGroupDisplayName);
								expect(res.body.pending).to.be.eql(false);

								resolve();
							});

					});
				}

				function removePendingGroup(){
					return new Promise((resolve, reject) => {

						db.models.group.remove({ displayName: pendingGroupDisplayName }, err => {
							if (err) reject(err);

							resolve();
						});
					});
				}

			});

		});

		describe('POST /group-category - ReSet groups category', () => {

			it('Should respond with 401 to a correct request as well', done => {

				request(express)
					.put('/api/admin/group-category')
					.send({ groupId: testGroupId, newCategory: 'orange' })
					.end((err, res) => {
						if (err) done(err);

						expect(res.status).to.eql(200);

						db.models.group.findById(testGroupId, (err, doc) => {
							if (err) return done(err);

							expect(doc.color).to.be.eql('orange');
						});

						request(express)
							.put('/api/admin/group-category')
							.send({ groupId: testGroupId, newCategory: 'sky' })
							.end((err, res) => {
								if (err) done(err);

								expect(res.status).to.eql(200);

								db.models.group.findById(testGroupId, (err, doc) => {
									if (err) return done(err);

									expect(doc.color).to.be.eql('sky');
								});

								done();
							});
					});

			});

		});

		describe('POST /group-namespace - Apply new namespace (/groups/${namespace})', () => {

			it('Should accept valid namespaces', done => {

				const validNamespaces = ['test123', 'test-123', 'test-test', 'really-really-long-namespace-really'];

				async.each(validNamespaces, changeNamespace, done);

				function changeNamespace(validNamespace, callback){

					request(express)
						.put(`/api/admin/group-namespace`)
						.send({ groupId: testGroupId, newNamespace: validNamespace })
						.end((err, res) => {
							if (err) done(err);

							expect(res.status).to.eql(200);

							callback();
						});

				}

			});

			it('Shouldn\'t accept invalid namespaces', done => {

				const invalidNamespaces = ['@test123', '..test-123', 'שדגtest-test', 'a', new Array(100).join('x')];

				async.each(invalidNamespaces, changeNamespace, done);

				function changeNamespace(invalidNamespace, callback){

					request(express)
						.put(`/api/admin/group-namespace`)
						.send({ groupId: testGroupId, newNamespace: invalidNamespace })
						.end((err, res) => {
							if (err) done(err);

							expect(res.status).to.eql(400);

							callback();
						});

				}

			});

		});

	});

	describe('Groups API', () => {

		describe('POST \'/\' - Add Group', () => {

			var validColor;

			it('Shouldn\'t allow creating a group without required data', done => {

				request(express)
					.post('/api/groups/')
					.end((err, res) => {
						if (err) done(err);

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

						// make sure it doesn't accept other / suggested color
						newGroupObj.color = 'other';
						request(express)
							.post('/api/groups/')
							.send(newGroupObj)
							.end((err, res) => {
								if (err) return done(err);

								expect(res.status).to.be.eql(400);

								done();
							});

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
								// this is then used by on client-side to redirect user to the newly created group profile
								expect(res.body._id).to.be.ok();
								expect(validMongoID(res.body._id)).to.be.ok();

								done();
							});

					});

			});

			it('Should not flag newly created group with pending flag', done => {

				const newGroupObj = {
					displayName: testGroupDisplayName,
					desc: 'desc',
					color: validColor,
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
							expect(groupDoc.pending).to.be.eql(false);

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

		let tasks = [ delete_test_group, delete_test_admin_user ];

		async.parallel(tasks, done);

		function delete_test_group(done){
			db.models.group.remove({ displayName: testGroupDisplayName }, done);
		}

		function delete_test_admin_user(){
			db.models.user.remove({ email: mockAdminEmail }, done);
		}
	});

});