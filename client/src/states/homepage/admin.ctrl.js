module.exports = ['api', controller];

function controller(api){

	var ctrl = this;

	api.users.getNewFaces(function(data){
		ctrl.newFaces = data.newFaces;
	});

	api.groups.getPending(function(data){
		ctrl.pendingGroups = data.pendingGroups;
	})

}