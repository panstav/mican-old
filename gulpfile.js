'use strict';

var path = require('path');

var common = require('./common');
var db = require('./server/services/db');
var packageJson = require('./package.json');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var autoprefixer = require('autoprefixer');
var usefulString = require('useful-string');

//-=======================================================---
//------------------ Micro Tasks
//-=======================================================---

gulp.task('clean', () => {

	let tempFiles = [
		'!public/.gitignore',           'public/*',             // compiled, static-served files
		'!client/snapshots/.gitignore', 'client/snapshots/*',   // snapshots cacher
		'!uploads/.gitignore',          'uploads/*'             // user uploads (images mainly)
	];

	return gulp.src(tempFiles, { read: false })
		.pipe(plugins.clean({ force: true }));

});

gulp.task('define-revision', () => {
	process.env.VERSIONSTR = process.env.SOURCE_VERSION ? '-' + process.env.SOURCE_VERSION.substr(0, 10) : '';
});

gulp.task('load-env', done => {
	require('./env');

	done();
});

gulp.task('prep-public-dir', () => {

	let copyPaste = [
		'client/manifest.json',
	  'client/browserconfig.xml',
	  'client/robots.txt',
	  'client/alefhebrew.css'
	];

	return gulp.src(copyPaste)
		.pipe(gulp.dest('public'));

});

gulp.task('polimap', () => {
	return gulp.src('client/polimap/**')
			.pipe(plugins.copy('public/polimap', { prefix: 2 }));
});

gulp.task('nodemon', () => {
	plugins.nodemon(
			{
				script: 'server/server.js',
				ignore: ['node_modules/**'],
				env: {
					'LOCAL': true
				}
			}
	);
});

//-=======================================================---
//------------------ Build
//-=======================================================---

gulp.task('font-awesome', () => {

	var fontAwesomeFiles = [
		'node_modules/font-awesome/css/*',
		'node_modules/font-awesome/fonts/*'
	];

	return gulp.src(fontAwesomeFiles)
		.pipe(plugins.copy('public/font-awesome/', { prefix: 2 }));

});

gulp.task('sass-to-css', () => {

	var sassOptions = process.env.LOCAL
		? { errLogToConsole: true, sourceComments : 'normal' }
		: { outputStyle: 'compressed' };

	var postcssOptions = [
		autoprefixer({ browsers: ['last 2 versions', '> 5%', 'ie > 8'] })
	];

	return gulp.src('client/src/index.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.rename({ basename: `global${ process.env.VERSIONSTR || '' }` }))
		.pipe(plugins.postcss(postcssOptions))
		.pipe(gulp.dest('public'));

});

gulp.task('jade-to-html', () => {

	var jadeOptions = {
		pretty: !!process.env.LOCAL,
		locals: { production: process.env.NODE_ENV === 'production' }
	};

	return gulp.src('client/src/**/*.jade')
		.pipe(plugins.data(jsonDataCollector))
		.pipe(plugins.jade(jadeOptions))
		.pipe(plugins.rename(partialsRenamer))
		.pipe(gulp.dest('public/partials'));

	function jsonDataCollector(file){
		var filename = path.basename(file.path, '.jade');

		if (filename !== 'index') return {};

		return require('./client/src/' + filename + '.json');
	}

	function partialsRenamer(path){

		// use hyphen-style instead of camelCase
		path.basename = usefulString.hyphenate(path.basename);

		// separate modals to a own folder
		path.dirname = path.dirname.indexOf('modal') > -1 ? 'modals' : '';

	}

});

gulp.task('construct-html-head', () => {

	var resources = buildResourcesObj();

	return gulp.src('public/partials/index.html')
		.pipe(plugins.htmlReplace(resources))
		.pipe(gulp.dest('public/partials'));

	function buildResourcesObj(){

		var resourcesObj = {};

		// insert page title and description
		resourcesObj.titledesc = {
			src: null,
			tpl:
`<title ng-bind="head.title">${ common.title }</title>
<meta name="description" ng-attr-content="{{ head.description }}" content="${ common.description }">
<meta name="author" content="${ common.author }">`
		};

		// insert the possibly versioned css file and the font-awesome loader
		resourcesObj.css = [
			`global${ process.env.VERSIONSTR || '' }.css`,
			`font-awesome/css/font-awesome${ process.env.NODE_ENV === 'production' ? '.min' : '' }.css`
		];

		// insert the possibly versioned js file as async script
		resourcesObj.js = {
			src: `bundle${ process.env.VERSIONSTR || '' }.js`,
			tpl: '<script async src="%s"></script>'
		};

		// insert google verification
		resourcesObj.google = {
			src: null,
			tpl: `<meta name="google-site-verification" content="${ process.env.GOOGLE_VERIFICATION }">`
		};

		// insert bing verification
		resourcesObj.bing = {
			src: null,
			tpl: `<meta name="msvalidate.01" content="${ process.env.BING_VERIFICATION }" />`
		};

		// insert facebook verification
		resourcesObj.facebook = {
			src: null,
			tpl: `
				<meta property="fb:admins" content="${ process.env.FACEBOOK_ADMIN_ID }" />
				<meta property="fb:app_id" content="${ process.env.FACEBOOK_APP_ID }" />
			`
		};

		// insert twitter card details
		resourcesObj.twitter = {
			src: null,
			tpl: `
				<meta name="twitter:card" ng-attr-content="{{ head.twitter.card }}" content="${ common.twitter.card }">
				<meta name="twitter:title" ng-attr-content="{{ head.title }}" content="${ common.title }">
				<meta name="twitter:description" ng-attr-content="{{ head.description }}" content="${ common.description }">
				<meta name="twitter:creator" ng-attr-content="{{ head.twitter.creator }}" content="${ common.twitter.creator }">
				<meta name="twitter:image" ng-attr-content="{{ head.image }}" content="${ common.logo.square }">
			`
		};

		// insert open graph details
		resourcesObj.opengraph = {
			src: null,
			tpl: `
				<meta property="og:site_name" content="${ common.site.name }">
				<meta property="og:locale" content="${ common.site.lang }">
				<meta property="og:title" ng-attr-content="{{ head.title }}" content="${ common.title }">
				<meta property="og:type" content="website">
				<meta property="og:url" ng-attr-content="{{ head.domain + head.path }}" content="${ common.domain }">
				<meta property="og:image" ng-attr-content="{{ head.image }}" content="${ common.logo.square }">
				<meta property="og:description" ng-attr-content="{{ head.description }}" content="${ common.description }">
			`
		};


		if (process.env.NODE_ENV === 'production'){

			// insert google analytics
			resourcesObj.analytics = {
				src: null,
				tpl: `<script>(function(i, s, o, g, r, a, m){i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function(){(i[r].q = i[r].q || []).push(arguments)}, i[r].l = 1*new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m)})(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');window.ga('create', '${ process.env.ANALYTICS_KEY }', 'auto');window.ga('send', 'pageview');</script>`
			};

			// minify injected templates
			for (let key in resourcesObj){
				if (resourcesObj[key].hasOwnProperty('tpl')){
					resourcesObj[key].tpl = resourcesObj[key].tpl.replace(/\n|\t/g, '')
				}
			}
		} else {

			// insert noindex meta tag
			resourcesObj.noIndex = {
				src: null,
				tpl: '<meta name="robots" content="noindex">'
			};

		}

		return resourcesObj;
	}

});

gulp.task('js', done => {

	var jsBundleFilename = `bundle${ process.env.VERSIONSTR || '' }.js`;

	getAsyncData()
		.then(buildWebpackOptions, err => done(err))
		.then(runWebpack);

	function getAsyncData(){

		// open database
		return new Promise(resolve => { db.init(resolve) })

			// fetch groups sum
			.then(queryGroupsSum)

			// close database
			.then(data => new Promise((resolve, reject) => {
				db.close(() => resolve(data));
			}));

		function queryGroupsSum(){

			const publicGroupsQuery = {
				pending: false,
				'blocked.value': false
			};

			return db.models.group.count(publicGroupsQuery).exec()
				.then(
					groupsSum => Promise.resolve({ groupsSum }),
					err => done(err)
				);
		}

	}

	function buildWebpackOptions(asyncData){

		var replacerOptions = StringReplacePlugin.replace(
			{ replacements: [

				{
					// inject facebook app id to be used from client side
					pattern: /FACEBOOK_APP_ID/,
					replacement: () => process.env.FACEBOOK_APP_ID
				},

				{
					// about page showcases dependencies
					// fetch them from package.json, filter and inject
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
				},

				{
					pattern: /DOMAIN_NAME/,
					replacement: () => common.domain
				},

				{
					// count number of groups
					pattern: /GROUPS_SUM/,
					replacement: () => asyncData.groupsSum
				}

			] }
		);

		var webpackOptions = {

			entry: './src/index.js',

			output: { path: './public', filename: jsBundleFilename },

			context: path.join(__dirname, 'client'),

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

			webpackOptions.plugins.push(new StatsPlugin('./webpack-stats.json', {}));
		}

		return Promise.resolve(webpackOptions);
	}

	function runWebpack(options){

		webpack(options, err => {
			if (err) throw new plugins.util.PluginError('webpack', err);

			let uglifier = process.env.NODE_ENV === 'production' ? plugins.uglify : plugins.util.noop;

			gulp.src(`public/${ jsBundleFilename }`)
				.pipe(uglifier())
				.pipe(gulp.dest('public/'));

			done();
		});

	}

});

//-=======================================================---
//------------------ Build ENVs
//-=======================================================---

gulp.task('build', plugins.sequence('prep-public-dir', ['font-awesome', 'polimap'], ['sass-to-css', 'jade-to-html'], 'construct-html-head', 'js'));

gulp.task('local', plugins.sequence('clean', 'load-env', 'build'));

gulp.task('remote', plugins.sequence('clean', 'define-revision', 'build'));

gulp.task('production-like', plugins.sequence('load-env', 'remote'));
