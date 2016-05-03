module.exports = ['mem', 'numberOf', controller];

function controller(mem, numberOf){

	const ctrl = this;

	this.argument = mem('editArgument', null, { scoped: true }) || {};

	this.numberOfComments = function(){
		return numberOf({ singular: 'תגובה אחת', plural: 'תגובות' }, ctrl.argument.comments, 'הוסף תגובה');
	};

	this.addComment = () => {

		const newComment = {
			content: ctrl.newComment,
			author: {
				displayName: 'שם המחבר',
				avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
			},
			date: '08.07.16',
			hour: '17:14',
			createdAt: new Date('07.08.16')
		};

		ctrl.argument.comments.push(newComment);

		ctrl.newCommentPosted = true;

	};

}