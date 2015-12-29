var mongoose = require('mongoose');

module.exports = function(id){

	if (!id) return false;

	// otherwise given id validity
	return mongoose.Types.ObjectId.isValid( typeof(id) === 'string' ? id : id.toString() );

};

module.exports.gen = function(){
	
	// generate a random mongoID
	return mongoose.Types.ObjectId().toString();

}