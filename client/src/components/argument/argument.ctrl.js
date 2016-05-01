module.exports = ['$scope',controller];

function controller($scope){

	console.log($scope);

	this.vote = (direction) => {
		$scope.argument.votes[direction]++;
	}

}