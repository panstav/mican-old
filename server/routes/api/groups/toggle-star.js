var log =           require('../../../services/log');

var async =         require('async');
var _ =             require('lodash');

var mongoose =      require('mongoose');
var groupModel =    mongoose.model('group');
var userModel =     mongoose.model('user');

var validMongoID =  require('../../../helpers/valid-mongo-id');
var normalizeID =   require('../../../helpers/normalize-id');

module.exports = function(req, res){

	if (!validMongoID(req.body.groupIdToStar)) return res.status(500).end();

	async.waterfall(
		[

			add_user_to_group_starredBy,

			add_group_to_user_starred

		],

		function(err, toggledOn, groupToken){
			if (err) return log.error(err);

			res.status(200).json({ groupToken: groupToken });

			if (toggledOn){
				var eventObj = {
					ec: 'Data Entry', ea: 'Follow', el: groupToken.displayName
				};

				req.track.event(eventObj).send();
			}
		}
	);

	function add_user_to_group_starredBy(step){

		groupModel.findById(req.body.groupIdToStar, function(err, starredDoc){
			if (err) return step(err);

			var _id = normalizeID(starredDoc._id);
			var groupToken = {
				_id: _id, displayName: starredDoc.displayName, link: starredDoc.namespace || _id
			};

			var direction = starredDoc.starredBy.indexOf(req.user._id) > -1 ? 'pull' : 'push';

			starredDoc.starredBy[direction](req.user._id);

			starredDoc.save(function(err){
				if (err) return step(err);

				step(null, starredDoc._id, groupToken);
			});
		});
	}

	function add_group_to_user_starred(groupID, groupToken, step){

		userModel.findById(req.user._id, function(err, staringDoc){
			if (err) return step(err);

			var direction = staringDoc.starred.indexOf(groupID) > -1 ? 'pull' : 'push';
			var nowFollowingGroups = direction === 'push';

			staringDoc.starred[direction](groupID);

			staringDoc.save(function(err){
				if (err) return step(err);

				step(null, nowFollowingGroups, groupToken);
			});
		});
	}

};