var log = require('../../../services/log');

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');

var validMongoID =  require('../../../helpers/valid-mongo-id');
var paraSplit =     require('../../../helpers/para-split');

module.exports = function(req, res){

	groupModel.findByIdAndUpdate(req.body.groupID, { desc: paraSplit(req.body.newDesc) }, function(err){

		if (err){
			log.error(err);

			return res.status(500).end();
		}

		res.status(200).end();
	});

};