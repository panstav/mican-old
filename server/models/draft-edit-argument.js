module.exports = {

	schema: {

		draftId: String,
		editId: String,
		authorId: String,

		content: String,
		association: String,
		// 'for' or 'against' edit at editId

		votes: {
			for: [String],
			against: [String]
		},

		comments: [
			{
				authorId: String,
				content: String
			}
		]

	},

	statics: {},

	virtuals: []

};