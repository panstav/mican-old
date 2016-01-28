var path = require('path');

var gulp =    require('gulp');
var plugins = require('gulp-load-plugins')();

var usefulString = require('useful-string');

module.exports.toHtml = () => {

	var jadeOptions = process.env.LOCAL ? { pretty: true } : {};

	return gulp.src('client/src/**/*.jade')
		.pipe(plugins.data((file) => {
			var filename = path.basename(file.path, '.jade');

			if (filename !== 'index') return {};

			var data = require('../client/src/' + filename + '.json');
			return data;
		}))
		.pipe(plugins.jade(jadeOptions))
		.pipe(plugins.rename(partialsRenamer))
		.pipe(gulp.dest('public/partials'));

	function partialsRenamer(path){

		// use hyphen-style instead of camelCase
		path.basename = usefulString.hyphenate(path.basename);

		// separate modals to a own folder
		path.dirname = path.dirname.indexOf('modal') > -1 ? 'modals' : '';

	}

};

module.exports.constructHead = () => {

	var resources = {};

	// insert the possibly versioned css file and the font-awesome loader
	resources.css = [
		`global${ process.env.VERSIONSTR || '' }.css`,
		`font-awesome/css/font-awesome${ process.env.NODE_ENV === 'production' ? '.min' : '' }.css`
	];

	// insert the possibly versioned js file as async script
	resources.js = {
		src: `bundle${ process.env.VERSIONSTR || '' }.js`,
		tpl: '<script async src="%s"></script>'
	};

	// insert noindex meta tag for non-production environments
	if (process.env.NODE_ENV !== 'production'){
		resources.noIndex = {
			src: null,
			tpl: '<meta name="robots" content="noindex">'
		};

	} else {

		// insert google verification
		resources.google = {
			src: null,
			tpl: `<meta name="google-site-verification" content="${ process.env.GOOGLE_VERIFICATION }">`
		};

		// insert bing verification
		resources.bing = {
			src: null,
			tpl: `<meta name="msvalidate.01" content="${ process.env.BING_VERIFICATION }" />`
		};
	}

	return gulp.src('public/partials/index.html')
		.pipe(plugins.htmlReplace(resources))
		.pipe(gulp.dest('public/partials'));

};