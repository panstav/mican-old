var expect = require('expect.js');
var async = require('async');
var _ = require('lodash');
var isHTML = require('is-html');

var agent = require('./common/agents').anon;

var log = require('../server/services/log');

var db = require('../server/services/db');
var common = require('./common');

var Auth = require('../server/middleware/auth');
var auth = Auth({ test: true });

describe('Public - Client Side', function(){

	it('Should serve homepage', done => {

		agent.asset('/', function(err, res){
			if (err) return done(err);

			expect(isHTML(res.text)).to.be.ok();
			expect(res.status).to.eql(200);

			done();
		});

	});

	it('Should serve robots.txt', done => {

		agent.asset('/robots.txt', function(err, res){
			if (err) return done(err);

			expect(res.status).to.eql(200);

			done();
		});

	});

	it('Should serve snapshots for url with "_escaped_fragment_" query', done => {

		var homepageHTML;

		async.series(
			[
				usual_homepage,

			  snapshot_homepage,

			  snapshot_homepage_with_corrent
			],

			function(err){
				if (err) return done(err);

				process.env.LOCAL = 'true';

				done();
			}
		);

		function usual_homepage(step){

			agent.asset('/', function(err, homepageRes){
				if (err) return step(err);

				expect(homepageRes.status).to.eql(200);

				homepageHTML = homepageRes.text;
				expect(isHTML(homepageHTML)).to.be.ok();

				step();
			});

		}

		function snapshot_homepage(step){

			agent.asset('/?_escaped_fragment_=', function(err, homepageNonSnapshotRes){
				if (err) return step(err);

				expect(homepageNonSnapshotRes.status).to.eql(200);
				expect(isHTML(homepageNonSnapshotRes.text)).to.be.ok();

				expect(homepageHTML).to.not.be.equal(homepageNonSnapshotRes.text);

				step();
			});

		}

		function snapshot_homepage_with_corrent(step){

			delete process.env.LOCAL;

			agent.asset('/?_escaped_fragment_=', function(err, homepageSnapshotRes){
				if (err) return step(err);

				expect(homepageSnapshotRes.status).to.eql(200);
				expect(isHTML(homepageSnapshotRes.text)).to.be.ok();

				expect(homepageHTML).to.not.be.equal(homepageSnapshotRes.text);

				step();
			});

		}

	});

	it('Should serve 404 for requests of non-existent snapshots', done => {

		delete process.env.LOCAL;

		agent.asset('/non-existant?_escaped_fragment_=', function(err, homepageSnapshotRes){
			if (err) return step(err);

			expect(homepageSnapshotRes.status).to.eql(404);

			process.env.LOCAL = 'true';

			done();
		});

	});

	it('Should respond with 404 to non-existant pages', done => {

		agent.asset('/non-existent-page', function(err, res){
			if (err) return done(err);

			expect(isHTML(res.text)).to.be.ok();
			expect(res.status).to.eql(404);

			done();
		});

	});

	it('Shouldn\'t respond with 404 to existent pages if though they\'re not express routes', done => {

		agent.asset('/groups', function(err, res){
			if (err) return done(err);

			expect(isHTML(res.text)).to.be.ok();
			expect(res.status).to.eql(200);

			done();
		});

	});

});

describe('Public - API', function(){

	describe('GET /recall', function(){

		it('Should retrieve an empty object for anonymous users', done => {

			agent.get('/api/recall', function(err, res){
				if (err) return done(err);

				expect(res.status).to.eql(200);
				expect(res.body.user).to.be.an('undefined');
				expect(res.body).to.be.an('object');
				expect(Object.keys(res.body).length).to.be.eql(0);

				done();
			});

		});

	});

	describe('GET /groups', function(){

		it('Should retrieve a collection of valid generalized groupDocs', function(done){

			agent.get('/api/groups', function(err, res){
				if (err) return done(err);

				var groups = res.body;

				expect(res.status).to.eql(200);
				expect(groups).to.be.an(Array);
				expect(groups.length).to.not.eql(0);

				_.each(groups, function(groupObj){

					expect(groupObj).to.be.an('object');
					expect(groupObj).to.have.keys(['_id', 'color', 'displayName', 'desc']);

				});

				common.uniqueValidMongoIDs(groups);

				done();
			});

		});

	});

	describe('GET /groups/:id', function(){

		it('Should serve public profile', done => {

			db.models.group.findOneRandom(function(err, randomDoc){
				if (err) return done(err);

				agent.get('/api/groups/' + randomDoc._id, function(err, res){
					if (err) return done(err);

					expect(res.status).to.eql(200);

					var groupDoc = res.body;

					common.publicGroupProfile(groupDoc);

					// since we're public here
					expect(groupDoc.pending).to.be(false);

					done();
				});
			});

		});

		it('Shouldn\'t show pending groups', done => {

			db.models.group.findOneRandom({ pending: true }, function(err, randomPendingGroup){
				if (err) return done(err);

				if (!randomPendingGroup){
					console.log('Not testing pending-groups-collection because there are no pending groups on DB');

					return done();
				}

				agent.get('/api/groups/' + randomPendingGroup._id, function(err, res){
					if (err) return done(err);

					var pendingDoc = res.body;

					expect(res.status).to.eql(423);

					expect(pendingDoc).to.be.an('object');
					expect(pendingDoc).to.only.have.key(['pending']);
					expect(pendingDoc.pending).to.be(true);

					done();
				});
			});

		});

		it('Should advice a redirection in case group has a namespace', done => {

			db.models.group.findOneRandom({ namespace: { $exists: true, $ne: '' }, pending: false }, function(err, groupDoc){
				if (err) return done(err);

				agent.get('/api/groups/' + groupDoc._id.toString(), function(err, res){
					if (err) return done(err);

					expect(res.status).to.be.eql(301);
					expect(res.body).to.have.key('groupHasNamespace');

					agent.get('/api/groups/' + res.body.groupHasNamespace, function(err, res){
						if (err) return done(err);

						expect(res.status).to.be.eql(200);

						done();
					});
				});
			});

		});

	});

	describe('GET /tasks', function(){

		it('Should retrieve a collection of valid generalized taskDocs', done => {

			agent.get('/api/tasks', function(err, res){

				if (err) return done(err);

				expect(res.status).to.be.eql(200);

				var tasks = res.body.tasks;

				expect(res.body).to.be.an('object');
				expect(tasks).to.be.an('array');
				expect(tasks).to.not.be.empty;

				_(tasks).each(function(taskObj){
					expect(taskObj).to.be.an('object');
					expect(taskObj).to.have.keys(['_id', 'createdAt', 'title', 'viewed', 'color', 'numVolunteers']);
				});

				common.uniqueValidMongoIDs(tasks);

				done();
			});

		});

	});

	describe('GET /tasks/:id', function(){

		it('Should retrieve a detailed, privBased task', done => {

			db.models.task.findOneRandom(function(err, randomDoc){
				if (err) return done(err);

				if (!randomDoc){
					console.log('Not testing privBased-task because there are no tasks on DB');

					return done();
				}

				agent.get('/api/groups/' + randomDoc._id, function(err, res){
					if (err) return done(err);

					expect(res.status).to.eql(200);

					expect(res.body).to.be.an('object');
					expect(res.body).to.not.be.empty;

					expect(res.body).to.have.keys(['createdAt', 'createdBy', 'title', 'desc', 'requirements', 'links']);
					expect(res.body).to.not.have.keys(['publicity', 'notifyEmail', 'volunteers', 'priority']);

					expect(isHumanizedDate(res.body.createdAt)).to.be.ok;

					done();

					function isHumanizedDate(dateStr){
						return dateStr.match(/^\d{1,2}\/\d{1,2}$/);
					}

				});
			});

		});

	});
});

describe('Public - Middleware', function(){

	describe('Auth', function(){

		it('Non registered user won\'t sneak in', done => {

			var passed = false;

			auth.test(null, null, function(){
				passed = true;
			});

			expect(passed).to.not.be.ok();

			done();
		});

	});

});