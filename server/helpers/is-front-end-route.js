var urlPattern = require('url-pattern');

var routered = [
	'/',
	'/about',
	'/groups(?modal=:modal)',
	'/groups/(:groupID)',
	'/tasks',
	'/tasks/(:taskID)',
  '/drafts',
  '/drafts/(:draftID)'
];

module.exports = function(url){

	return routered.some(function(route){
		var pattern = new urlPattern(route);

		return pattern.match(url) !== null;
	});

};