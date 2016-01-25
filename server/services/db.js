var fs =          require('fs');

var mongoose =    require('mongoose');
var random =      require('mongoose-simple-random');

var requireDir =  require('require-dir');
var async =       require('async');
var _ =           require('lodash');
var moment =      require('moment');
var sm =          require('sitemap');
var git =         require('git-last-commit');

var log =         require('./log');
var urls =        require('../helpers/urls');

var schemas =     requireDir('../models');
var models = {};

module.exports = {

	init,

	regenerateSitemap,

	get models(){ return models }

};

function init(callback){

	callback = _.isFunction(callback) ? callback : _.noop;

	var dbURI = process.env.LOCAL && !process.env.REMOTE_DB
		? process.env.LOCAL_MONGO_URL
		: process.env.MONGOHQ_URL;

	mongoose.connect(dbURI);

	mongoose.connection.on('connected', function(){
		log.info('Mongoose connection established: ' + mongoose.connection.host + ':' + mongoose.connection.port);
	});

	mongoose.connection.on('error', function(err){
		log.error(err);
	});

	mongoose.connection.on('disconnected', function(){
		log.warn('Mongoose connection disconnected');
	});

	// assign to models obj and mongoose.model method
	_.forIn(schemas, function(model, name){

		// init schema
		var schema = new mongoose.Schema(model.schema);

		// methods form random docs retrieval
		schema.plugin(random);

		// statics
		_.forIn(model.statics, function(static, name){
			schema.statics[name] = static;
		});

		// virtuals
		_.each(model.virtuals, function(virtual){
			schema.virtual(virtual.name)[virtual.method](virtual.resolve);
		});

		models[name] = mongoose.model(name, schema);
	});

	callback();
}

function regenerateSitemap(callback){

	log.debug('Initiating sitemap regeneration,');

	var dayOfLastCommit, priorities = {
		topPages: 1,
		groupPages: 0.5
	};

	async.series(
		[
			set_day_of_last_commit_and_map,

			prep_all_group_profiles,

		  write_sitemap_for_serve

		], err => {
			if (err){
				if (_.isFunction(callback)) return callback(err);

				return log.error(err);
			}

			log.debug('Sitemap regeneration complete.')
		}
	);

	function set_day_of_last_commit_and_map(done){

		git.getLastCommit((err, commit) => {

			var sitemapDateFormat = 'YYYY-MM-DD';

			if (err || !commit){
				dayOfLastCommit = moment().format(sitemapDateFormat);

				log.error(err || 'no commit');

			} else {
				dayOfLastCommit = moment(commit.committedOn, 'X').format(sitemapDateFormat);
			}

			map = [
				{
					url: '/',
					changefreq: 'monthly',
					priority: priorities.topPages,
					lastmod: dayOfLastCommit
				},

				{
					url: '/groups',
					changefreq: 'weekly',
					priority: priorities.topPages,
					lastmod: dayOfLastCommit
				},

				{
					url: '/tasks',
					changefreq: 'daily',
					priority: priorities.topPages,
					lastmod: dayOfLastCommit
				},

				{
					url: '/map',
					changefreq: 'never',
					priority: priorities.topPages,
					lastmod: '2014-04-01'
				}
			];

			done();
		});
	}

	function prep_all_group_profiles(done){

		models.group.find({ pending: false, 'blocked.value': false }, 'namespace', function(err, groups){
			if (err) return done(err);
			if (!groups) return done({ groups: groups });

			groups.forEach(group => {

				map.push(
					{
						changefreq: 'weekly',
						priority: priorities.groupPages,
						lastmod: dayOfLastCommit,
						url: '/groups/' + (group.namespace ? group.namespace : group._id.toString())
					}
				);

			});

			done();
		});

	}

	function write_sitemap_for_serve(done){
		var sitemap = sm.createSitemap({ hostname: urls.domain, urls: map });

		fs.writeFile('public/sitemap.xml', sitemap.toString(), done);
	}

}