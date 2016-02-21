var log =           require('../services/log');

var fs =            require('fs');
var async =         require('async');
var cloudinary =    require('cloudinary');
var multipart =     require('connect-multiparty')({ uploadDir: 'uploads' });

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');
var userModel =     mongoose.model('user');

var auth =          require('../middleware/auth');

var validMongoID =  require('../helpers/valid-mongo-id');
var normalizeID =   require('../helpers/normalize-id');
var urls =          require('../helpers/urls');

module.exports = function(router){

	router.post(['/hero', '/logo'], multipart, auth({ groupAdmin: 'body:groupID' }), uploadHeroLogo);

	router.post('/profile-image', multipart, auth(), uploadProfileImage);

};

function uploadHeroLogo(req, res){

	var path = req.files.file.path, type, maxSize, limitCrop;

	if (req.path.indexOf('hero') > -1){
		type = 'hero';
		maxSize = 1000 * 1000;
		limitCrop = 1200

	} else {
		type = 'logo';
		maxSize = 300 * 1000;
		limitCrop = 300
	}

	async.waterfall(
		[
			check_file_size,

			delete_previous_if_already_exists,

			upload_to_cloudinary,

			update_groupDoc
		],

		// finally, delete the temp file
		function(err){
			if (err) log.error(err);

			fs.unlinkSync(path);
		}
	);

	function check_file_size(step){

		fs.stat(path, function(err, stats) {
			if (err){
				res.status(500).end();

				return step(err);
			}

			if (stats.size > maxSize){
				return res.status(403).json({ prompt: 'imageTooBig' });
			}

			step();
		});
	}

	function delete_previous_if_already_exists(step){

		var groupID = JSON.parse(req.body.data).groupID;

		groupModel.findById(groupID, 'admins displayName ' + (type === 'hero' ? 'profile' : 'logo'), function(err, groupDoc){
			if (err){
				res.status(500).end();

				return step(err);
			}

			if (!groupDoc) return res.status(404).end();

			var newImage = {
				url:      type === 'logo' ? groupDoc.logo.url       : groupDoc.profile.hero.url,
				publicID: type === 'logo' ? groupDoc.logo.public_id : groupDoc.profile.hero.public_id
			};

			if (!newImage.url) return step(null, groupDoc);

			cloudinary.api.delete_resources([newImage.publicID], function(result){
				if (result.error){
					res.status(500).end();

					return step(result);
				}

				step(null, groupDoc);
			});

		});
	}

	function upload_to_cloudinary(groupDoc, step){

		cloudinary.uploader.upload(path, function(result){
			if (result.error){
				res.status(500).end();

				return step(result);
			}

			req.track({ cat: 'data-entry', label: `group-${type}`, groupID: normalizeID(groupDoc._id) });

			step(null, result, groupDoc);
		});
	}

	function update_groupDoc(newImage, groupDoc, step){

		var resJson;

		if (type === 'logo'){
			groupDoc.logo.public_id = newImage.public_id;
			groupDoc.logo.url = cloudinary.url(newImage.public_id, { secure: true, width: limitCrop, crop: 'limit' });

			resJson = { newLogoUrl: groupDoc.logo.url }
		} else {
			groupDoc.profile.hero.public_id = newImage.public_id;
			groupDoc.profile.hero.url = cloudinary.url(newImage.public_id, { secure: true, width: limitCrop, crop: 'limit' });

			resJson = { newHeroUrl: groupDoc.profile.hero.url }
		}

		groupDoc.save(function(err){
			if (err){
				res.status(500).end();

				return step(true)
			}

			res.status(201).json(resJson);

			step();
		});
	}

}

function uploadProfileImage(req, res){

	var filePath = req.files.file.path;

	// for any error, step directly to final callback - that delete the temporary file
	async.waterfall(
		[

			check_file_size,

			delete_previous_if_already_exists,

			upload_to_cloudinary,

			update_userDoc

		],

		// finally, delete the temp file
		function(err){
			if (err) log.error(err);

			fs.unlinkSync(filePath);
		}
	);

	function check_file_size(step){

		fs.stat(filePath, function (err, stats) {
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (stats.size > 300 * 1000) return res.status(403).json({ prompt: 'imageTooBig' });

			step();
		});
	}

	function delete_previous_if_already_exists(step){

		userModel.findById(normalizeID(req.user._id), 'profilePhotoUrl', function(err, userDoc){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			if (!userDoc) return res.status(404).end();

			var profileImage = userDoc.profilePhotoUrl;

			// skip if user didn't have own profile image
			if (!profileImage || profileImage === urls.anonAvatar) return step(null, userDoc);

			var profileImageID = profileImage.substr(profileImage.lastIndexOf('/') + 1);

			cloudinary.api.delete_resources(profileImageID, function(result){
        if (result.error){
	        log.error(result);

	        return res.status(500).end();
        }

				step(null, userDoc);
			});
		});
	}

	function upload_to_cloudinary(userDoc, step){

		cloudinary.uploader.upload(filePath, function(result){
			if (result.error){
				log.error(err);

				return res.status(500).end();
			}

			step(null, result, userDoc);
		});
	}

	function update_userDoc(newImage, userDoc, step){

		userDoc.profilePhotoUrl = cloudinary.url(newImage.public_id, { secure: true, width: 100, height: 100, crop: "fill" });

		userDoc.save(function(err){
			if (err){
				log.error(err);

				return res.status(500).end();
			}

			res.status(201).json({ newProfilePhotoUrl: userDoc.profilePhotoUrl });

			step();
		});
	}

}