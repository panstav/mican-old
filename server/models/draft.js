const moment = require('moment');

module.exports = {

	schema: {

		creator: String,

		title: String,
		desc: String,

		admins: [String],
		participants: [String],

		viewed: { type: Number, default: 0 }

	},

	statics: {},

	virtuals: []

};