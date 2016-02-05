'use strict';

var expect = require('expect.js');
var request = require('supertest');
var async = require('async');

var isHTML = require('is-html');

var express = require('../server').init();

before(() => {
	// define test env
	process.env.NODE_ENV = 'test';
});

describe('Public - Assets', function(){

	it('Should serve homepage', done => {

		request(express)
			.get('/')
			.end((err, res) => {
				if (err) throw err;

				expect(isHTML(res.text)).to.be.ok();
				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should serve robots.txt', done => {

		request(express)
			.get('/robots.txt')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should serve sitemap.xml', done => {

		request(express)
			.get('/sitemap.xml')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should serve manifest.json', done => {

		request(express)
			.get('/manifest.json')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should serve browserconfig.xml', done => {

		request(express)
			.get('/browserconfig.xml')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should serve alefhebrew.css', done => {

		request(express)
			.get('/alefhebrew.css')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Shouldn\'t respond with 404 to existent pages if they\'re not express routes', done => {

		request(express)
			.get('/groups')
			.set('Accept', 'text/html')
			.end((err, res) => {
				if (err) throw err;

				expect(isHTML(res.text)).to.be.ok();
				expect(res.status).to.eql(200);

				done();
			});

	});

	it('Should 404 to /add-group', done => {

		request(express)
			.get('/add-group')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(404);

				done();
			});

	});

});

describe('Public - Snapshots', () => {

	it('Should serve 404 for requests of non-existent snapshots', done => {

		request(express)
			.get('/non-existant?_escaped_fragment_=')
			.set('Accept', 'text/html')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(404);

				done();
			});

	});

});

describe('Public - Groups API', () => {

	describe('POST \'/\' - Add Group', () => {

		it('Shouldn\'t allow a public user to access this endpoint', done => {

			request(express)
				.post('/api/groups/')
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(401);

					done();
				});

		});

	});

	describe('POST \'/suggest\' - Suggest Group', () => {
		
		it('Shouldn\'t allow a GET request', done => {
			
			request(express)
				.get('/api/groups/suggest')
				.end((err, res) => {
					if (err) throw err;
			
					expect(res.status).to.eql(404);

					// sending GET to /api/groups/name should return a profile of a group by that displayName
					// or a get-group-by-id 404
					expect(res.body).to.have.key('noSuchGroup');
			
					done();
				});
			
		});

		it('Shouldn\'t allow an empty POST request', done => {

			request(express)
				.post('/api/groups/suggest')
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(400);

					done();
				});

		});

		it('Shouldn\'t allow a POST request with empty displayName', done => {

			request(express)
				.post('/api/groups/suggest')
				.send({ displayName: '' })
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(400);

					done();
				});

		});

		it('Shouldn\'t allow suggesting without a contacts property', done => {

			async.parallel([ test_undefined_contact_obj, test_empty_contact_obj ], done);

			function test_undefined_contact_obj(callback){

				let suggestionObj = { displayName: 'suggestion-test' };

				request(express)
					.post('/api/groups/suggest')
					.send(suggestionObj)
					.end((err, res) => {
						if (err) throw err;

						expect(res.status).to.eql(400);

						callback();
					});

			}

			function test_empty_contact_obj(callback){

				let suggestionObj = { displayName: 'suggestion-test', contacts: [] };

				request(express)
					.post('/api/groups/suggest')
					.send(suggestionObj)
					.end((err, res) => {
						if (err) throw err;

						expect(res.status).to.eql(400);

						callback();
					});

			}

		});

		it('Shouldn\'t allow suggesting without a single valid contact', done => {

			let suggestionObj = {
				displayName: 'suggestion-test',
				contacts: [
					{ type: 'mail', value: 'non-valid-property' }
				]
			};

			request(express)
				.post('/api/groups/suggest')
				.send(suggestionObj)
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(400);
					expect(res.body.invalidEmailAddress).to.be.ok();

					done();
				});

		});

		it('Should accept a suggestion that has a single valid property', done => {

			let suggestionObj = {
				displayName: 'suggestion-test',
				contacts: [{ type :'mail', value: 'valid@address.com'}]
			};

			request(express)
				.post('/api/groups/suggest')
				.send(suggestionObj)
				.end((err, res) => {
					if (err) throw err;

					expect(res.status).to.eql(200);

					done();
				});

		});

	});

});

after(() => {
	// close express instance
	express.listen().close();
});