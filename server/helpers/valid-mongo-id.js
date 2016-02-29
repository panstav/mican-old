const mongoose = require('mongoose');

module.exports = id => {

	if (!id) return false;

	const stringID = typeof(id) === 'string' ? id : id.toString();

	const mongooseCheck = mongoose.Types.ObjectId.isValid(stringID);
	const regExpCheck = /^[0-9a-fA-F]{24}$/.test(stringID);

	return mongooseCheck && regExpCheck;
};

// generate a random mongoID
module.exports.gen = () => mongoose.Types.ObjectId().toString();