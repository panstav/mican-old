var expect = require('expect.js');

var _ = require('lodash');
var is = require('is_js');

var validMongoID = require('../../server/helpers/valid-mongo-id');

module.exports = {

	loadAngular: loadAngular,

	uniqueValidMongoIDs: uniqueValidMongoIDs,

	publicGroupProfile: publicGroupProfile

};

function loadAngular(angularThing, service){
	var provider = angularThing[angularThing.length-1];

	return service ? provider : provider();
}

function uniqueValidMongoIDs(docs){

	var result = true;

	if (!is.array(docs)){

		expect(validMongoID(docs._id)).to.be.ok();

	} else {

		var ids = docs.map(function(doc){
			return doc._id;
		});

		ids.forEach(function(id){
			expect(validMongoID(id)).to.be.ok();
		});

		var uniqueArray = _.unique(ids);

		expect(ids.length === uniqueArray.length).to.be.ok();

	}

}

function publicGroupProfile(profile){

	expect(profile).to.be.an('object');
	expect(profile).to.have.keys(
		[
			'_id',
			'color',
			'createdAt',
			'desc',
			'displayName',
			'organization',
			'pending',
			'profile',
			'relatedGroups'
		]
	);
	expect(profile).to.not.have.keys('admins');

	expect(profile.createdAt).to.be.a('number');

	expect(profile.desc).to.be.an('array');
	expect(profile.desc.length).to.not.be.lessThan(1);

	expect(profile.relatedGroups).to.be.an('array');
	expect(profile.relatedGroups.length).to.be.eql(3);

}