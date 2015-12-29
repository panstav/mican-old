module.exports = function(id){

	if (typeof(id) === 'string') return id;

	if (typeof(id) === 'object') return id.toString();

	return undefined;
};