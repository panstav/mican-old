var normalizeID = require('./normalize-id');

module.exports = {

	aggMatcher: aggMatcher,

	predicate: predicate

};

function aggMatcher(user, keyForGroupID, groupID){

	groupID = normalizeID(groupID);
	keyForGroupID = keyForGroupID || '_id';

	// build matcher based on user privilege
	var aggMatcher = { publicity: 'public' };

	// optionally add a specific group to match
	if (groupID) aggMatcher[keyForGroupID] = groupID;

	if (user){

		// user is registered - add option to matcher
		aggMatcher = { $or: [{ publicity: 'public' }, { publicity: 'registered' }] };

		if (groupID){

			// a specific group was requested
			// add it if user is admin or is a follower of that group

			if (user.starred.indexOf(groupID) > -1 || user.roles.indexOf('admin') > -1){

				aggMatcher = {};
				aggMatcher[keyForGroupID] = groupID;

			}

		} else if (user.starred.length){

			// a specific group was not requested, so we want all relevant group to add their tasks
			user.starred.forEach(function(followedGroup){

				var objToPush = {};
				objToPush[keyForGroupID] = followedGroup;

				aggMatcher.$or.push(objToPush);

			});
		}
	}

	return aggMatcher;
}

function predicate(publicityType, user, groupID){

	if (publicityType === 'public') return true;

	// user must be registered (at least) to receive any non public info
	if (!user) return false;

	var userIsAdmin     = user.roles.indexOf('admin') > -1 || user.admining.indexOf(groupID) > -1;
	var isForRegistered = publicityType === 'registered';
	var userIsFollower  = user.starred.length && user.starred.indexOf(groupID) > -1;

	return userIsAdmin || isForRegistered || userIsFollower;
}