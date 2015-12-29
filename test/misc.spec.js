var expect = require('expect.js');
var request = require('request');

var validMongoID = require('../server/helpers/valid-mongo-id');
var guid = require('../server/helpers/guid');

describe('Misc', function(){

	describe('Remote Website', function(){

		it.skip('Should redirect "mican.co.il" to the full & secure "https://www.mican.co.il"', function(done){

			if (!process.env.IS_ONLINE) return done;

			var options = {
				url: 'http://mican.co.il',
				followRedirect: false
			};

			request(options, function(err, res){
				if (err) return done(err);

				expect(res.statusCode).to.be.eql(301);
				expect(res.headers.location).to.be.eql('https://www.darkenu.net');

				done();
			});

		});

	});

	describe('Helpers', function(){

		describe('Valid-MongoID', function(){

			it('Should return false for invalid IDs', function(){

				var invalidID = 'invalidID';

				expect(validMongoID(invalidID)).to.not.be.ok();

			});

			it('Should retrieve a valid mongo ID with 0 arguments', function(){

				var validRandomID = validMongoID.gen();

				expect(typeof validRandomID === 'string').to.be.ok();

				var validity = validMongoID(validRandomID);

				expect(validity).to.be.ok();

			});

		});

		describe('Guid', function(){

			it('Should generate a random string for each call', function(){

				var randA = guid();
				var randB = guid();

				expect(randA).to.be.a('string');
				expect(randB).to.be.a('string');
				expect(randA).to.not.be.eql(randB);

			});

			it ('Should generate a string with specified number of characters', function(){

				var lenA = Math.round(Math.random() * 30) + 1;
				var lenB = Math.round(Math.random() * 30) + 1;

				expect(guid(lenA).length).to.be.eql(lenA);
				expect(guid(lenB).length).to.be.eql(lenB);

			});

		});

	});

});