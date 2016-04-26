module.exports = router => {

	// user requests a draft's page
	router.get('/drafts/:draftId', (req, res, next) => {

		// check id is mongo valid

		// query draft doc by id, project: 'authorId title desc content checksum comments viewed participants'
		// count draft-edits, active and accepted separately
		// turn participants into an integer
		// split createdAt to humane date and hour to draft and every comment
		// query authorTokens and attach them to draft and comments
		// delete authorId from draft and comments
		// json out

	});

	// user clicks on suggested-edits to view active edit-proposals
	router.get('/drafts/:draftId/suggestions', (req, res, next) => {

		// check id is mongo valid

		// query corresponding draft-edit docs that are {state: 'active'}, project: 'authorId title desc changes votes'
		// turn votes into integers
		// split createdAt to humane date and hour
		// query authorTokens and attach them to draft and comments
		// json out

	});

	// when a user clicks on history commits to view accepted edit-proposals
	router.get('/drafts/:draftId/history', (req, res, next) => {

		// check id is mongo valid

		// query corresponding draft-edit docs that are {state: 'accepted'}, project: 'authorId title desc changes previousDraft updatedAt comments'
		// split updatedAt to humane date and hour
		// query authorTokens and attach them to draft and comments

	});

	// user sends a new edit-proposal
	router.post('/drafts/:draftId/suggestion'/*, auth()*/, (req, res, next) => {

		// validate body against scheme: { checksum: String, changes: [ para: Number, content: String, previously: String ] }

		// check id is mongo valid

		// query draft, project: 'checksum'
		// check that checksum matched the one at body.checksum
		// check that paraIndex is unique per change in body.changes

		// loops over body.changes as change
		// const changes = diff.diffChars(change.previously, change.content)
		// !changes.filter(change => change.added || change.removed).length to make sure changes were made
		// changes.map(change => { newChange = { para: X }; if (change.added){ newChange.state = 'add'; } else if (change.removed){ newChange.state = 'remove'; } else { newChange.state = 'stay'; } newChange.content = change.value; return newChange; })
		// make sure at least one of the newChanges is either 'add' or 'remove'

		// save editObj
		// recheck checksum, and if it doesn't match - moveEditToPending(editId)
		// json out

	});

};