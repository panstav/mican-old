const template = require('./loader.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {},

		restrict: 'E',

		template

	};
}