var validMongoID = require('../helpers/valid-mongo-id');
var normalizeID = require('../helpers/normalize-id');
var moment = require('moment');

module.exports = {

	schema: {

		createdAt: { type: Number, default: moment().unix() },
		roles: [ String ],

		email: String,
		otherEmails: [ String ],
		admining: [ String ],

		profilePhotoUrl: String,
		displayName: String,
		gender: String,

		google: {
			accessToken: String,
			id: String,
			link: String
		},

		facebook: {
			accessToken: String,
			id: String,
			link: String
		},

		starred: [ String ],
		tasksCompleted: { type: Number, default: 0 },

		blocked: {
			value: { type: Boolean, default: false },
			reason: String
		},

		confirmed: {

			email: {
				code: String,
				timeframe: String,

				value: { type: Boolean, default: false }
			},

			linkToMail: {
				code: String,
				timeframe: Number,

				fails: [ Number ]
			}

		}
	},

	statics: {

		findByIdsAndTokenize: function(ids, callback){

			if (!ids.length) return callback(null, []);

			var badIDs = ids.filter(function(id){ return !validMongoID(id) });
			if (!badIDs.length) return callback({ badArgs: true, badIDs: badIDs });

			this.find({ _id: { $in: ids } }, 'displayName profilePhotoUrl', function(err, userDocs){

				if (err) return callback(err);

				if (!userDocs.length) return callback({ noSuchUsers: true });

				var userTokens = userDocs.map(function(userDoc){
					return {
						_id: normalizeID(userDoc._id),
						displayName: userDoc.displayName,
						profilePhotoUrl: userDoc.profilePhotoUrl
					}
				});

				callback(null, userTokens);
			});
		},

		isGroupAdmin: function(args, callback){

			if ( !validMongoID(args.userID) || !validMongoID(args.groupID) ) return callback({ badArgs: true });

			this.findById(args.userID, function(err, userDoc){

				if (err) return callback(err);

				if (!userDoc) return callback({ noSuchUser: true });

				var userIsAnAdmin = adminChecks.app || adminChecks.group;
				var adminChecks = {
					app: userDoc.roles.indexOf('admin') > -1,
					group: userDoc.admining.indexOf(args.groupID) > -1
				};

				callback(!userIsAnAdmin ? { userIsntAnAdmin: true, adminChecks: adminChecks } : null, userDoc);

			});
		}

	},

	virtuals: []

};