var request = require('supertest');

module.exports = function(agent){

	return {

		asset: function(address, test){

			request(agent)
				.get(address)
				.set('Accept', 'text/html')
				.end(test);

		},

		get: function(address, test){

			request(agent)
				.get(address)
				.set('Accept', 'application/json')
				.end(test);

		},

		post: function(address, data, test){

			request(agent)
				.post(address)
				.send(data)
				.set('Accept', 'application/json')
				.end(test);

		}

	}

};