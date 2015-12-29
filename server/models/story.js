var moment = require('moment');

module.exports = {

	schema: {

		createdAt: { type: Number, default: moment().unix() },
		createdBy: String,

		// userIDs that were involved in task
		participators: [ String ],

		// whether the group is waiting to pass control
		pending: { type: Boolean, default: true },

		blocked: {
			value: { type: Boolean, default: false },
			reason: String
		},

		content: [ String ],
		viewed: { type: Number, default: 0 },

		// user ids that have starred this group
		likedBy: [ String ]

	},

	statics: {},

	virtuals: [

		// number of followers
		{
			name: 'numLikes',
			method: 'get',
			resolve: function(){ return this.likedBy.length }
		}

	]

};