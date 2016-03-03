module.exports = (angularThing, provider) => {
	const func = angularThing[angularThing.length-1];

	return provider ? func() : func;
};