module.exports = ['$scope', 'modal', 'numberOf', controller];

function controller($scope, modal, numberOf){

	const ctrl = this;

	this.vote = direction => {
		$scope.argument.votes[direction]++;
	};

	this.numberOfComments = function(){
		return numberOf({ singular: 'תגובה אחת', plural: 'תגובות' }, $scope.argument.comments, 'הוסף תגובה');
	};

	this.showComments = () => {
		modal.open('argument-comments', { editArgument: $scope.argument });
	};

}