module.exports = {

	schema: {

		draftId: String,
		authorId: String,

		title: String,
		description: String,

		changes: [
			{
				para: Number,   // index of paragraph in draft
				state: String,  // 'stay', 'add', or 'remove'
				content: String
			}
		],

		state: { value: String, reason: String },
		// --value
		// 'active'   => ongoing debate for a possible approval
		// 'pending'  => waiting for merge or hold for some reason
		// 'accepted' => sealed for further changes, part of draft history

		// --reason
		// when state.value === 'pending', reason can be 'awaiting-merge'
		// or something else, explaining manual hiding of edit

		previousDraft: String,
		// populated with draft right before draft is updated with

		votes: {
			for: [String],
			against: [String]
		},

		viewed: { type: Number, default: 0 }

	},

	statics: {},

	virtuals: []

};