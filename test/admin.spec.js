var expect = require('expect.js');
var agent = require('./common/agents').admin;

var db = require('../server/services/db');
var validMongoID = require('../server/helpers/valid-mongo-id');

var common = require('./common/index');

var Auth = require('../server/middleware/auth');

var adminReq;

before(function(done){

	db.models.user.findOneRandom({ roles: 'admin' }, function(err, randomAdminDoc){
		if (err) return done(err);

		adminReq = {
			user: randomAdminDoc.toObject()
		};

		done();
	});

});

describe('Admin - API', function(){

	describe('GET /groups/:id', function(){

		it('Should serve pending groups to an admin', servePendingGroupsToo);

		function servePendingGroupsToo(done){

			db.models.group.findOneRandom({ pending: true }, function(err, randomPendingGroup){
				if (err) return done(err);

				if (!randomPendingGroup) return done('Not testing pending-groups-collection because there are no pending groups on DB');

				agent.get('/api/groups/' + randomPendingGroup._id, function(err, res){
					if (err) return done(err);

					var pendingDoc = res.body;

					expect(res.status).to.eql(200);

					common.publicGroupProfile(pendingDoc);

					expect(pendingDoc.userIsAdmin).to.be(true);
					expect(pendingDoc.pending).to.be(true);

					done();
				});
			});
		}

	});

});

describe('Admin - Middleware', function(){

	describe('Auth', function(){

		it('Admin actions are available only if user has correct role', adminFlagDemandsAdminRole);

		it('Should let Admin skip groupAdmin checks', adminSkipsGroupAdminChecks);

		it('Shouln\'t let Admin skip blocked check', blockedAdminIsBlocked);

		function adminFlagDemandsAdminRole(done){

			var passed = false;

			Auth({ admin: true, test: true }).test(adminReq, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		}

		function adminSkipsGroupAdminChecks(done){

			var passed = false;

			Auth({ groupAdmin: validMongoID.gen(), test: true }).test(adminReq, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		}

		function blockedAdminIsBlocked(done){

			var passed = false;

			var blockedAdminReq = adminReq;
			blockedAdminReq.user.blocked = { value: true };

			Auth({ admin: true, test: true }).test(blockedAdminReq, null, function(){
				passed = true;
			});

			expect(passed).to.not.be.ok();

			done();
		}

	});

});

//describe('isAdmin', function(){
//
//	var isAdmin = require('../server/middleware/is-admin');
//
//	it('Should assign the method to req.user when available', function(done){
//
//		bare.get('/test/req-user-keys', userAsTest, isAdmin, function(req, res){
//			res.json({ userKeys: Object.keys(req.user) });
//		});
//
//		request(bare)
//			.get('/test/req-user-keys')
//			.set('Accept', 'application/json')
//			.end(
//			function(err, res){
//
//				expect(res.status).be.eql(200);
//				expect(res.body.userKeys).to.eql(['test', 'isAdmin']);
//
//				done(err);
//			});
//
//		function userAsTest(req, res, next){
//			req.user = { test: true };
//
//			next();
//		}
//
//	});
//
//	it('Should return false for no role', function(done){
//
//		bare.get('/test/is-admin-without-role', userAsTestWithNoRole, isAdmin, function(req, res){
//			res.json({ isAdminReturns: req.user.isAdmin() });
//		});
//
//		request(bare)
//			.get('/test/is-admin-without-role')
//			.set('Accept', 'application/json')
//			.end(
//			function(err, res){
//
//				expect(res.status).be.eql(200);
//				expect(res.body.isAdminReturns).to.be(false);
//
//				done(err);
//			});
//
//		function userAsTestWithNoRole(req, res, next){
//			req.user = { test: true, roles: [] };
//
//			next();
//		}
//
//	});
//
//	it('Should return true for no appAdmin role', function(done){
//
//		bare.get('/test/is-admin-with-app-admin-role', userAsTestWithAdminRole, isAdmin, function(req, res){
//			res.json({ isAdminReturns: req.user.isAdmin() });
//		});
//
//		request(bare)
//			.get('/test/is-admin-with-app-admin-role')
//			.set('Accept', 'application/json')
//			.end(
//			function(err, res){
//
//				expect(res.status).be.eql(200);
//				expect(res.body.isAdminReturns).to.be(true);
//
//				done(err);
//			});
//
//		function userAsTestWithAdminRole(req, res, next){
//			req.user = { test: true, roles: ['admin'] };
//
//			next();
//		}
//
//	});
//
//	it('Should return false for wrong admining groupID', function(done){
//
//		bare.get('/test/is-admin-with-wrong-groupid', userAsTestWithNoRoleAdmining, isAdmin, function(req, res){
//			res.json({ isAdminReturns: req.user.isAdmin('321') });
//		});
//
//		request(bare)
//			.get('/test/is-admin-with-wrong-groupid')
//			.set('Accept', 'application/json')
//			.end(
//			function(err, res){
//
//				expect(res.status).be.eql(200);
//				expect(res.body.isAdminReturns).to.be(false);
//
//				done(err);
//			});
//
//		function userAsTestWithNoRoleAdmining(req, res, next){
//			req.user = { test: true, roles: [], admining: ['123'] };
//
//			next();
//		}
//
//	});
//
//	it('Should return trie for correct admining groupID', function(done){
//
//		bare.get('/test/is-admin-with-correct-groupid', userAsTestWithNoRoleAdmining, isAdmin, function(req, res){
//			res.json({ isAdminReturns: req.user.isAdmin('123') });
//		});
//
//		request(bare)
//			.get('/test/is-admin-with-correct-groupid')
//			.set('Accept', 'application/json')
//			.end(
//			function(err, res){
//
//				expect(res.status).be.eql(200);
//				expect(res.body.isAdminReturns).to.be(true);
//
//				done(err);
//			});
//
//		function userAsTestWithNoRoleAdmining(req, res, next){
//			req.user = { test: true, roles: [], admining: ['123'] };
//
//			next();
//		}
//
//	});
//});