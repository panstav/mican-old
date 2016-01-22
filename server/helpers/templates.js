var urls = require('./urls');

module.exports = {

	feedback: function(args){

		var mailStr = '<h3>עמוד הבית</h3>\n<p>' + args.opinion.homepage + '</p>\n\n<h3>לוח היוזמות</h3>\n<p>' + args.opinion.groups + '</p>\n\n<h3>מערך ההתנדבות</h3>\n<p>' + args.opinion.volunteering + '</p>\n\n<h3>ההתחברות לאתר</h3>\n<p>' + args.opinion.login + '</p>\n\n<h3>באג</h3>\n<p>' + args.bug + '</p>\n\n<h3>רעיון</h3>\n<p>' + args.idea + '</p>\n\n<h3>אחר</h3>\n<p>' + args.opinion.misc + '</p>\n<p>הפידבק הגיע מהכתובת - ' + args.url;

		if (args.userID){
			mailStr += '<br>ממשתמש - ' + args.userID;
		}
		mailStr += '<br>מקלאיינט - ' + args.useragent + '</p>';

		return wrap(mailStr);
	},

	linkByMail: function(args){
		return wrap('ליחצו על הלינק על מנת לחזור ל- \'מכאן\':<br><a href="' + urls.domain + '/auth/login-by-mail?userid=' + args.userID + '&code=' + args.code + '" target="_blank">' + urls.domain + '/auth/login-by-mail?userid=' + args.userID + '&code=' + args.code + '</a>')
	},

	emailConfirmation: function(secret){
		return wrap('<p>מייל זה מגיע אליכם בעקבות בקשת אימות-מייל באתר <a href="' + urls.domain + '" target="_blank">מכאן</a>.</p>\n\n\t\t<a href="' + urls.domain + '/confirm-email/' + secret + '">ליחצו כאן על מנת לחזור לאתר.</a>')
	},

	newFieldSuggestion: function(args){
		return wrap('<p>הצעת חזית עשייה: ' + args.suggestedField + '</p>\n<p>ליוזמה: ' + args.groupDisplayName + ' (<a href="' + urls.domain + '/groups/' + args.groupID + '" target="_blank">' + args.groupID + '</a>)</p>\n<p>מהמשתמש: ' + args.userID + '</p>');
	},

	newVolunteer: function(args){

		return wrap('<span>שם: ' + args.user.displayName + '</span><br><span>ליצירת קשר במייל: <a href="mailto:' + args.user.email + '">' + args.user.email + '</a></span><br>' + (args.message ? '<span>הודעה מהמתנדב: ' + args.message + '</span><br><br>' : '') + '<span>לינק ישיר למשימה: <a href="' + args.taskLink + '" target="_blank">' + args.taskLink + '</a></span>');
	},

	newAnonVolunteer: function(args){

		var channel, hrefType;

		if (args.anon.contact.channel === 'email'){
			channel = 'מייל';
			hrefType = 'mailto:';
		} else {
			channel = 'טלפון';
			hrefType = 'tel:';
		}

		return wrap('<span>שם: ' + args.anon.fullName + '</span><br><span>ליצירת קשר ב' + channel + ': <a href="' + hrefType + args.anon.contact.value + '">' + args.anon.contact.value + '</a></span><br>' + (args.anon.message ? '<span>הודעה מהמתנדב: ' + args.anon.message + '</span><br><br>' : '') + '<span>לינק ישיר למשימה: <a href="' + args.taskLink + '" target="_blank">' + args.taskLink + '</a></span>');
	},

	notifyVolunteersOfTaskUpdate: function(args){

		return wrap('<span>לידיעתך - היוזמה "' + args.groupTitle + '" עידכנה את פרטי המשימה "' + args.taskTitle + '".</span><br><br>\n\n<span>לינק ישיר למשימה: <a href="' + args.taskLink + '" target="_blank">' + args.taskLink + '</a></span>');

	},

	notifyVolunteersOfTaskCompletion: function(args){

		return wrap('<span>לידיעתך - היוזמה "<a href="' + args.groupLink + '" target="_blank">' + args.groupDisplayName + '</a>" סימנה שהמשימה שהתנדבת אליה - "' + args.taskTitle + '" - הושלמה!</span><br><br><span>במערכת מכאן יש עוד הרבה משימות והזדמנויות להתנדב - <a href="' + urls.domain + '/tasks" target="_blank">עמוד המשימות</a>.</span>');

	},

	notifyVolunteersOfTaskCancelation: function(args){

		return wrap('<span>לידיעתך - היוזמה "<a href="' + args.groupLink + '" target="_blank">' + args.groupDisplayName + '</a>" סימנה שהמשימה שהתנדבת אליה - "' + args.taskTitle + '" - בוטלה!</span><br><br><span>במערכת מכאן יש עוד הרבה משימות והזדמנויות להתנדב - <a href="' + urls.domain + '/tasks" target="_blank">עמוד המשימות</a>.</span>');

	}

};

function wrap(content){

	var styles = '<style>\n\n\t.container{\n\t\tdirection: rtl;\n\t\tmax-width: 700px;\n\t\tmargin: auto;\n\t\tpadding: 0 20px 20px;\n\t}\n\n\t.header{\n\t\tfont-weight: bold;\n\t\tbackground-color: white;\n\t\ttext-align: center;\n\t\tfont-size: 32px;\n\t\tmargin: 20px auto 20px;\n\t\tpadding-bottom: 25px;\n\t\tcolor: #F5BF36;\n\t}\n\n\t.main{\n\t\tfont-size: 16px;\n\t\tcolor: #707070;\n\t}\n\n\t.footnotes{\n\t\tpadding-top: 75px;\n\t\tfont-size: 13px;\n\t\tcolor: #a3a3a3;\n\t}\n\n</style>';

	var wrapperStart = '<div class="container">\n\n\t<div class="header">מכאן</div>\n\n\t<div class="main">';

	var wrapperEnd = '</div><div class="footnotes">\n\n\t\t<p>במידה ואינכם יודעים במה מדובר - ניתן להתעלם ממייל זה.</p>\n\t\t<p>אך אם הבעייה חוזרת על עצמה - אנא, פנו לכתובת - <a href="mailto:' + urls.supportAddress + '">' + urls.supportAddress + '</a></p></div></div>';

	return styles + wrapperStart + content + wrapperEnd;
}