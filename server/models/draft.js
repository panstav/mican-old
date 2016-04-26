module.exports = {

	schema: {

		authorId: String,

		title: String,
		desc: String,

		admins: [String],
		participants: [String],

		content: String,
		checksum: String,

		comments: [
			{
				authorId: String,
				content: String
			}
		],

		viewed: { type: Number, default: 0 }

	},

	statics: {},

	virtuals: []

};