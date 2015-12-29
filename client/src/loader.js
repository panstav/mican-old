var camelcase = require('camelcase');

var app = angular.module('app');

var dircReq = require.context('./', true, /\.dirc\.js$/);
var servReq = require.context('./', true, /\.serv\.js$/);
var ctrlReq = require.context('./', true, /modals\/.+\.ctrl\.js$/);

dircReq.keys().forEach(function(path){
	var patResult = path.match(/\/([a-zA-Z\-]+)\/([a-zA-Z\-]+)\.dirc\.js$/);
	var name = patResult[2];

	if (name === 'admin'){
		name = 'admin-' + patResult[1];

	} else if (path.match('states')){
		name = 'state-' + name;
	}

	app.directive(camelcase(name), dircReq(path));
});

servReq.keys().forEach(function(path){
	var name = path.match(/\/([a-zA-Z\-]+)\.serv\.js$/)[1];

	app.factory(camelcase(name), servReq(path));
});

ctrlReq.keys().forEach(function(path){
	var name = path.match(/modals\/([a-zA-Z\-]+)\.ctrl\.js$/)[1];

	app.controller(camelcase(name) + 'Ctrl', ctrlReq(path));
});