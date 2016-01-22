'use strict';

var path = require('path');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var packageJson = require('../package.json');

module.exports.bundle = done => {

	var jsBundleFilename = `bundle${ process.env.VERSIONSTR || '' }.js`;

	// inject google analytics key to be used from client side
	let googleAnalyticsKey = {
		pattern: /ANALYTICS_KEY/,
		replacement: () => process.env.ANALYTICS_KEY
	};

	// inject facebook app id to be used from client side
	let facebookAppId = {
		pattern: /FACEBOOK_APP_ID/,
		replacement: () => process.env.FACEBOOK_APP_ID
	};
	
	// about page showcases dependencies
	// fetch them from package.json, filter and inject
	let filteredPackageDependecies = {
		pattern: /PACKAGE_JSON_FILTERED_DEPENDENCIES/,
		replacement: () => {

			let unwantedDeps = ['angular', 'passport', 'mongo', 'font-awesome', 'cloudinary', 'universal-analytics', 'mailchimp-api', 'mandrill-api', 'express', 'passport-facebook', 'passport-google-oauth', 'passport-strategy'];

			// get all deps, including devDeps
			// remove unwanted depencencies
			// and set titles and urls to direct to the npmjs.com package
			let filteredDeps = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies))
				.filter(dep => unwantedDeps.indexOf(dep) === -1)
				.map(dep => ({ title: dep, url: `https://www.npmjs.com/package/${ dep }` }));

			return JSON.stringify(filteredDeps);
		}
	};

	var domainName = {
		pattern: /DOMAIN_NAME/,
		replacement: () => require('../common').domain
	};

	var replacerOptions = StringReplacePlugin.replace(
		{ replacements: [ googleAnalyticsKey, facebookAppId, filteredPackageDependecies, domainName ] }
	);

	var webpackOptions = {

		entry: './src/index.js',

		output: { path: './public', filename: jsBundleFilename },

		context: path.join(__dirname, '../client'),

		plugins: [
			new StringReplacePlugin()
		],

		module: {
			loaders: [

				// es2015 => inject(es5)
				{ test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] }, exclude: /(node_modules|bower_components)/ },

				// jade => inject(html)
				{ test: /\.jade/, loader: 'html!jade-html' },

				// files with dynamic data => inject(data)
				{ test: /index\.js/, loader: replacerOptions }

			]
		}
	};

	// on a local machine - log webpack stats
	if (process.env.LOCAL && process.env.DEBUG){
		var StatsPlugin = require('stats-webpack-plugin');

		webpackOptions.plugins.push(new StatsPlugin('../../webpack-stats.json', {}));
	}

	webpack(webpackOptions, err => {
		if (err) throw new plugins.util.PluginError('webpack', err);

		let uglifier = process.env.NODE_ENV === 'production' ? plugins.uglify : plugins.util.noop;

		gulp.src(`public/${ jsBundleFilename }`)
			.pipe(uglifier())
			.pipe(gulp.dest('public/'));

		done();
	});

};