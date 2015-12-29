module.exports = function(req, res, next){

	if (req.user){

		req.user.isAdmin = function(groupID){

			if (req.user.roles.indexOf('admin') > -1) return true;

			if (groupID && req.user.admining.indexOf(groupID) > -1) return true;

			return false;
		}
	}

	next();
};