var expect = require('expect.js');
var common = require('./common');

describe('Angular - Common', function(){

	describe('Build Url', function(){

		var buildUrl  = common.loadAngular(require('../client/src/common/functions/build-url.serv.js'));

		it('Should attach a "?" to a url without keys', function(){

			var urlWithSingleKey = buildUrl('api/endpoint', 'variation', '1');
			expect(urlWithSingleKey).to.be.eql('api/endpoint?variation=1');

		});

		it('Should attach a "&" to a url with existing keys', function(){

			var urlWithTwoKeys = buildUrl('api/endpoint?variation=2', 'option', '3');
			expect(urlWithTwoKeys).to.be.eql('api/endpoint?variation=2&option=3');

		});

	});

	describe('Genderize', function(){

		var genderize = common.loadAngular(require('../client/src/common/functions/genderize.serv.js'), true);

		it('Should return the correct gender option', function(){

			var genderizedOptions = {
				male: 'he',
				female: 'she',
				fallback: 'it'
			};

			var userObj = {
				getGender: function(){
					return 'male';
				}
			};

			var deferByGender = genderize(userObj);

			expect(deferByGender(genderizedOptions)).to.eql('he');

		});

		it('Should fallback to third option if options didn\'t provide an option userGender', function(){

			var genderizedOptions = {
				male: 'he',
				female: 'she',
				fallback: 'it'
			};

			var userObj = {
				getGender: function(){
					return 'not valid';
				}
			};

			var deferByGender = genderize(userObj);

			expect(deferByGender(genderizedOptions)).to.eql('it');
		});

	});

	describe('Got Hebrew', function(){

		var gotHebrew = common.loadAngular(require('../client/src/common/functions/got-hebrew.serv.js'));

		it('Should return false for a string that containing no hebrew', function(){

			expect(gotHebrew('no hebrew')).to.not.be.ok();

		});

		it('Should return true for a string that containing even a single character with hebrew', function(){

			expect(gotHebrew('no hebrew, just ע')).to.be.ok();

		});

	});

});