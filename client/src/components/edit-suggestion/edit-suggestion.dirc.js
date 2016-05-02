const template = require('./edit-suggestion.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			suggestion: '=value',
			voting: '@'
		},

		restrict: 'E',

		template

	};
}