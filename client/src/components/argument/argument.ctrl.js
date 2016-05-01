module.exports = ['$scope', 'modal', controller];

function controller($scope, modal){

	const ctrl = this;

	this.vote = (direction) => {
		$scope.argument.votes[direction]++;
	};

	this.addComment = () => {
		modal.open('add-argument-comment', { editArgument: $scope.argument });
	};

	this.showComments = () => {
		modal.open('argument-comments', { editArgument: $scope.argument });
	};



}