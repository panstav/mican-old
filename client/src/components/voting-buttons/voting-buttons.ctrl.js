module.exports = ['$scope', controller];

function controller($scope){

	const ctrl = this;

	this.vote = vote => {
		$scope.userVoted = $scope.userVoted === vote ? null : vote;
	};

	this.buttonClasses = buttonType => {
		return `${ $scope.userVoted === buttonType ? 'active ' : '' }${ $scope.buttonClasses }`;
	}

}