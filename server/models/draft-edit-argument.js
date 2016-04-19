const moment = require('moment');

module.exports = {

	schema: {

		draft: String,
		edit: String,

		createdAt: { type: Number, default: moment().unix() },
		creator: String,

		content: String,
		association: String,

		votes: {
			for: [String],
			against: [String]
		},

		comments: [
			{
				createdAt: { type: Number, default: moment().unix() },
				creator: String,
				content: String
			}
		]

	},

	statics: {},

	virtuals: []

};