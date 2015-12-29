var expect = require('expect.js');
var is = require('is_js');

var db = require('../server/services/db');
var agent = require('./common/agents').user;

var Auth = require('../server/middleware/auth');
var auth = Auth({ test: true });
var userReq;

before(function(done){

	// querying a user with a non-empty admining collection
	// that is not an admin
	var cond = {
		admining: { $exists: true, $not: {$size: 0} },
		roles: []
	};

	db.models.user.findOneRandom(cond, function(err, randomUserDoc){
		if (err) return done(err);

		userReq = {
			user: randomUserDoc.toObject()
		};

		done();
	});

});

describe('User - API', function(){

	describe('GET /recall', function(){

		it('Should retrieve a full userObj for registered users', done => {

			agent.get('/api/recall', function(err, res){
				if (err) return done(err);

				expect(res.status).to.eql(200);
				expect(res.body.user).to.be.an('object');

				var userObjKeys = [
					'id', 'email', 'displayName', 'gender',
					'profilePhotoUrl', 'photo',
					'confirmed', 'isAdmin', 'admining', 'following'
				];

				expect(res.body.user).to.have.keys(userObjKeys);

				expect(res.body.user.id).to.be.a('string');
				expect(res.body.user.email).to.be.a('string');
				expect(is.email(res.body.user.email)).to.be.ok();
				expect(res.body.user.displayName).to.be.a('string');
				expect(res.body.user.gender).to.be.a('string');
				expect(res.body.user.profilePhotoUrl).to.be.a('string');
				expect(res.body.user.photo).to.be.a('string');
				expect(res.body.user.confirmed).to.be.an('object');
				expect(res.body.user.isAdmin).to.be.a('boolean');
				expect(res.body.user.admining).to.be.an('array');
				expect(res.body.user.following).to.be.an('array');

				done();
			});

		});

	});

});

describe('User - Middleware', function(){

	describe('Auth', function(){

		it('Registered user has access of default Auth', done => {

			var passed = false;

			auth.test(userReq, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		});

		it('GroupAdmin actions allowed with clear groupID', done => {

			var passed = false;

			Auth({ groupAdmin: userReq.user.admining[0], test: true }).test(userReq, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		});

		it('Same with body:reqIndicator', done => {

			var passed = false;
			var adminReqWithBodyKey = userReq;

			adminReqWithBodyKey.body = { groupID: userReq.user.admining[0] };

			Auth({ groupAdmin: 'body:groupID', test: true }).test(adminReqWithBodyKey, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		});

		it('And with params:reqIndicator', done => {

			var passed = false;
			var adminReqWithParam = userReq;

			adminReqWithParam.params = { groupID: userReq.user.admining[0] };

			Auth({ groupAdmin: 'params:groupID', test: true }).test(adminReqWithParam, null, function(){
				passed = true;
			});

			expect(passed).to.be.ok();

			done();
		});

		it('Should be blocked by the admin flag', done => {

			var passed = false;

			Auth({ admin: true, test: true }).test(userReq, null, function(){
				passed = true;
			});

			expect(passed).to.not.be.ok();

			done();

		});

	});

});