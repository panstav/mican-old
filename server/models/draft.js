const moment = require('moment');

module.exports = {

	schema: {

		createdAt: { type: Number, default: moment().unix() },
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