const moment = require('moment');

module.exports = {

	schema: {

		draft: String,

		creator: String,

		title: String,
		desc: String,
		rational: String,

		changes: {
			draftSnapshot: String
		},

		state: String,

		votes: {
			for: [String],
			against: [String]
		},

		viewed: { type: Number, default: 0 }

	},

	statics: {},

	virtuals: []

};