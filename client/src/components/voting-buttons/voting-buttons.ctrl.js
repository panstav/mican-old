module.exports = ['$scope', controller];

function controller($scope){

	const ctrl = this;

	this.vote = vote => {
		$scope.userVoted = vote;
	};

	this.buttonClasses = buttonType => {
		return `${ $scope.userVoted === buttonType ? 'active ' : '' }${ $scope.buttonClasses }`;
	}

}