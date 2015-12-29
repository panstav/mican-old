var mongoose =      require('mongoose');
var validMongoID =  require('../helpers/valid-mongo-id');

var moment =        require('moment');
var urls =          require('../helpers/urls');

module.exports = {
	schema: {

		createdAt: { type: Number, default: moment().unix() },

		// whether the group is waiting to pass control
		pending: { type: Boolean, default: true },

		blocked: {
			value: { type: Boolean, default: false },
			reason: String
		},

		// user ids that have complete control of the group
		admins: [ String ],

		profile: {
			viewed: { type: Number, default: 0 },

			hero: {
				url: String,

				// the original cloudinary id
				public_id: String
			},

			events: [
				{
					title: String,
					date: Number,
					link: String
				}
			],

			contacts: [
				{
					channel: String,           // mail / tel / link
					value: String,
					nameOfContact: String,
					publicity: String      // public / registered / followers
				}
			],

			tasks: [ String ],
			tasksCompleted: { type: Number, default: 0 }
		},

		logo: {
			url: String,

			// the original cloudinary id
			public_id: String
		},

		namespace: String,
		displayName: String,
		desc: [ String ],
		organization: { type: Boolean, default: false },
		color: String,
		link: String,

		links: {

			homepage: String,

			google: String,
			facebook: String,
			twitter: String

		},

		// user ids that have starred this group
		starredBy: [ String ]

	},

	statics: {

		getGroupUrl: function(groupID, callback){

			if (!validMongoID(groupID)) return callback({ invalidID: true, groupID: groupID });

			this.findById(groupID, 'namespace', function(err, groupDoc){

				if (err) return callback(err);

				if (!groupDoc) return callback({ groupDocMissing: groupDoc });

				callback(null, urls.domain + '/groups/' + (groupDoc.namespace || groupDoc._id));
			})
		}

	},

	virtuals: [

		// number of followers
		{
			name: 'numFollowers',
			method: 'get',
			resolve: function(){ return this.starredBy.length }
		}

	]

};