'use strict';

var log = require('./services/log');
if (process.env.LOCAL) log.trace({ env: process.env }, 'Environment');

//-=======================================================---
//------------------ Required
//-=======================================================---

// HTTP Client
var express =  require('express');
var enrouten =      require('express-enrouten');
var enforce =       require('express-sslify');

// Web Helpers
var session =       require('express-session');
var bodyParser =    require('body-parser');
var compression =   require('compression');

// Data Stores
var mongoose =      require('mongoose');
var MongoStore =    require('connect-mongo')(session);
var db =            require('./services/db');

var cloudinary =    require('cloudinary');

// Tools
var moment =        require('moment');

// Custom Helpers
var urls =          require('./helpers/urls');
var track =         require('./services/track');
var snapshooter =   require('./middleware/snapshooter');
var fourOhFour =    require('./middleware/four-o-four');
var errorHandler =  require('./middleware/error-handler');

module.exports.init = () => {

	log.debug('Initializing Server.js');

	// Boing
	var server = express();

	//-=======================================================---
	//------------------ Setup
	//-=======================================================---

	log.debug('Configuring Express App');

	// A fix for dealing with DNS for heroku apps
	if (process.env.HEROKU) server.enable('trust proxy');

	// enforce https on production environment
	if (process.env.NODE_ENV === 'production' && process.env.SECURE){
		server.use(enforce.HTTPS({ trustProtoHeader: true }));
		server.use(HSTS({ expiryDate: '24/01/2017' }));
	}

	// optionally mock a user (for test purposes)
	if (process.env.LOCAL && process.env.MOCK_USER) server.use(require('./mock-user'));

	log.debug('Establishing Cloudinary && Mongo connections');

	if (!process.env.MONGO_CONNECTED) integrateDatabase();

	integrateCloudinary();

	// prettify output json by default on non-production env
	if (process.env.NODE_ENV !== 'production') server.set('json spaces', 4);

	//-=======================================================---
	//------------------ Party
	//-=======================================================---

	log.debug('Attaching Express Middleware');

	// compress everything
	if (process.env.NODE_ENV === 'production') server.use(compression());

	// allow access to static assets
	server.use(express.static('public', {

		// set maxage of cache to 10 days, for static files - in production env
		maxAge: process.env.NODE_ENV === 'production' ? 1000 * 60 * 60 * 24 * 10 : 0
	}));

	server.use(track.middleware);

	// provide snapshots for crawlers
	server.use(snapshooter);

	// store session-id at 'connect.sid' cookie
	server.use(getSessionController());

	setLoginPolicies();

	// POST'ed json is at req.body
	server.use(bodyParser.json());
	server.use(bodyParser.urlencoded({ extended: true }));

	server.use(log.reqTracer);

	// register routes by folder/filename
	server.use(enrouten({ directory: 'routes' }));

	//-=======================================================---
	//------------------ Fallback Routes
	//-=======================================================---

	// 500
	server.use(errorHandler);

	// 404
	server.use(fourOhFour);

	return server;

	function HSTS(options){
		return (req, res, next) => {

			// set the 'Strict-Transport-Security' to the number of seconds until SSL certificate is expired
			let maxAgeInSeconds = moment(options.expiryDate, 'DD/MM/YY').diff(moment(), 'seconds');
			res.setHeader('Strict-Transport-Security', `max-age=${ maxAgeInSeconds }`);

			next();
		};
	}

	function integrateDatabase(){

		if (!process.env.LOCAL_MONGO_URL && !process.env.MONGOHQ_URL){
			log.error('MongoDB credentials are missing, database is mendatory.');
			log.info('Check the readme file for instructions.');

			process.exit(1);
		}

		// greet database, bind models and generate a sitemap
		db.init(db.regenerateSitemap);

	}

	function integrateCloudinary(){

		if (!process.env.CLOUDINARY_APIKEY) return log.warn('Cloudinary credentials are missing, image uploading is not operational.');

		// greet cloudinary img service
		cloudinary.config(
			{
				cloud_name: process.env.CLOUDINARY_CLOUDNAME,
				api_key:    process.env.CLOUDINARY_APIKEY,
				api_secret: process.env.CLOUDINARY_SECRET
			}
		);

	}

	function setLoginPolicies(){

		if (!process.env.GOOGLE_CLIENT_ID || !process.env.FACEBOOK_APP_ID) return log.warn('Social login credentials are missing, social login is not operational.');

		// set passport policy
		require('./registry.js')(server);

	}

	function getSessionController(){

		const sessionOptions = {
			secret: process.env.SESSION_SECRET,
			cookie: { secure: !!process.env.SECURE, maxAge: 2 * 60 * 60 * 1000, rolling: true },
			resave: false,
			saveUninitialized: false
		};

		if (process.env.MONGOHQ_URL && process.env.DATABASE_NAME){

			const storeOptions = {
				mongooseConnection: mongoose.connections[0],
				stringify: false
			};
			
			sessionOptions.store = new MongoStore(storeOptions);
		}

		return session(sessionOptions);
	}

};