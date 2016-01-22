var request = require('supertest');

var expect = require('expect.js');
var isHTML = require('is-html');

var express = require('../server').init();
require('../env');

describe('Public - Client Side', function(){

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

	it('Should serve 404 for requests of non-existent snapshots', done => {

		delete process.env.LOCAL;

		request(express)
			.get('/non-existant?_escaped_fragment_=')
			.set('Accept', 'text/html')
			.end((err, res) => {
				if (err) throw err;

				expect(res.status).to.eql(404);

				process.env.LOCAL = 'true';

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

});