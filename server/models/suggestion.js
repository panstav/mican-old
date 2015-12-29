var moment = require('moment');

module.exports = {

	schema: {

		createdAt: { type: Number, default: moment().unix() },
		createdBy: String,

		bucket: { type: String, default: 'misc' },
		value: String

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