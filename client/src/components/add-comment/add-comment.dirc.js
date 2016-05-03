const template = require('./add-comment.jade');

module.exports = [directive];

function directive(){
	return {

		scope: {
			content: '=',
			send: '&',
			buttonClass: '@'
		},

		restrict: 'E',

		template

	};
}