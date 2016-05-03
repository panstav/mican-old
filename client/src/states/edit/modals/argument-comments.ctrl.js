module.exports = ['mem', controller];

function controller(mem){

	const ctrl = this;

	this.argument = mem('editArgument', null, { scoped: true }) || {};

	this.numberOfComments = () => {

		if (!ctrl.argument.comments.length) return 'אין תגובות';

		if (ctrl.argument.comments.length === 1) return 'תגובה אחת';

		return ctrl.argument.comments.length + ' תגובות';
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