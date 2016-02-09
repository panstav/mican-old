var fs =            require('fs');
var path =          require('path');

var log =           require('../services/log');

var htmlSnapshots = require('html-snapshots');
var urls =          require('../helpers/urls');
var isFrontEndRoute = require('../helpers/is-front-end-route');

module.exports = function(req, res, next){

	var userAgent = req.headers['user-agent'] || '';

	var isntFrontEndRoute = !isFrontEndRoute(req.path);
	var didntRequestSnapshot = !req.query.hasOwnProperty('_escaped_fragment_');
	var isntFacebot = !userAgent.match('facebookexternalhit') && !userAgent.match('Facebot');

	log.trace({
		url: req.url,
		isntFrontEndRoute: isntFrontEndRoute,
		didntRequestSnapshot: didntRequestSnapshot,
		isntFacebot: isntFacebot
	}, 'Sharpshooter Check');
	
	if (isntFrontEndRoute || ( didntRequestSnapshot && isntFacebot )) return next();

	fetchSnapshot(req.path, function(err, results){
		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.sendFile(results[0], { root: path.resolve(__dirname, '../../') });
	});

	function fetchSnapshot(path, done){

		var testPath = './client/snapshots' + path + '/index.html';

		fs.exists(testPath, function(exists){

			if (exists) return done(null, [testPath]);

			var snapOptions = {
				processLimit: 1,

				outputDir: './client/snapshots',
				outputDirClean: false,
				input: 'array',
				source: [urls.domain + path],
				timeout: 10000
			};

			req.track({ cat: 'snapshot' });

			htmlSnapshots.run(snapOptions, done);
		});
	}

};