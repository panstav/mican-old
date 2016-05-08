module.exports = ['$scope', controller];

function controller($scope){

	const ctrl = this;

	this.removeLimit = () => {
		$scope.limit = null;
	}

}