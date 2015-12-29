var db = require('../../../services/db');
var log = require('../../../services/log');

var urls = require('../../../helpers/urls');

module.exports = function(req, res){

	var query = { $and: [ { profilePhotoUrl: { $ne: '' } }, { profilePhotoUrl: { $ne: urls.anonAvatar } } ] };
	var projection = 'displayName createdAt profilePhotoUrl';
	var opts = { sort: { createdBy: -1 }, limit: 20 };

	db.models.user.find(query, projection, opts, function(err, docs){
		if (err) return log.error(err);

		// if empty simply return empty list
		if (!docs || !docs.length) return res.json({ newFaces: [] });

		// prep for submission
		var newFaces = docs.map(plainObjectWithProperProps);

		res.json({ newFaces: newFaces });
	});

	function plainObjectWithProperProps(doc){

		// transform to plain object
		var docObj = doc.toObject();

		// rename profilePhoto
		docObj.src = docObj.profilePhotoUrl;
		delete docObj.profilePhotoUrl;

		return docObj;
	}

};