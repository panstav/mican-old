'use strict';

var urls = require('./../../helpers/urls');

var templates = {

	suggestGroup: function(args){

		let contacts = `<p>פרטי קשר</p>`;
		if (args.link) contacts += `<span>אתר אינטרנט: <a href="${args.link}" target="_blank" rel="noopener">${args.link}</a></span><br>`;
		if (args.mail) contacts += `<span>כתובת מייל: <a href="mailto:${args.mail}">${args.mail}</a></span><br>`;
		if (args.tel) contacts += `<span>מספר טלפון: <a href="tel:${args.tel}">${args.tel}</a></span>`;

		return `<p>נשלחה המלצה חדשה ליוזמה בשם - "${args.displayName}"</p>` + contacts;
	},

	feedback: function(args){

		var userStr = args.userID
			? `<br>ממשתמש - ${args.userID}`
			: `<br>מקלאיינט - ${args.useragent}`;

		var mailStr = `
		<h3>עמוד הבית</h3>
		<p>${args.opinion.homepage}</p>

		<h3>לוח היוזמות</h3>
		<p>${args.opinion.groups}</p>

		<h3>מערך ההתנדבות</h3>
		<p>${args.opinion.volunteering}</p>

		<h3>ההתחברות לאתר</h3>
		<p>${args.opinion.login}</p>

		<h3>באג</h3>
		<p>${args.bug}</p>

		<h3>רעיון</h3><p>${args.idea}</p>

		<h3>אחר</h3>
		<p>${args.opinion.misc}</p>

		<p>הפידבק הגיע מהכתובת - ${args.url}<br>${userStr}</p>
		`;

		return mailStr;
	},

	linkByMail: function(args){
		let url = `${urls.domain}/auth/login-by-mail?userid=${args.userID}&code=${args.code}`;

		return `ליחצו על הלינק על מנת לחזור ל- 'מכאן':<br><a href="${url}" target="_blank" rel="noopener">url</a>	`;
	},

	emailConfirmation: function(secret){
		return `
			<p>מייל זה מגיע אליכם בעקבות בקשת אימות-מייל באתר <a href="${urls.domain}" target="_blank" rel="noopener">מכאן</a>.</p>
			<a href="${urls.domain}/confirm-email/${secret}">ליחצו כאן על מנת לחזור לאתר.</a>
		`;
	},

	newVolunteer: function(args){

		let message = args.message ? `<span>הודעה מהמתנדב: ${args.message}</span><br><br>` : '';

		return `
			<span>שם: ' + args.user.displayName + '</span><br>
			<span>ליצירת קשר במייל: <a href="mailto:${args.user.email}">${args.user.email}</a></span><br>
			${message}
			<span>לינק ישיר למשימה: <a href="${args.taskLink}" target="_blank" rel="noopener">${args.taskLink}</a></span>
		`;
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

		let message = args.anon.message ? `<span>הודעה מהמתנדב: ${args.anon.message}</span><br><br>` : '';

		return `
		<span>שם: ${args.anon.fullName}</span><br>
		<span>ליצירת קשר ב${channel}: <a href="${hrefType + args.anon.contact.value}">${args.anon.contact.value}</a></span><br>
		${message}<span>לינק ישיר למשימה: <a href="${args.taskLink}" target="_blank" rel="noopener">${args.taskLink}</a></span>
		`;
	},

	notifyVolunteersOfTaskUpdate: function(args){

		return `
		<span>לידיעתך - היוזמה "${args.groupTitle}" עידכנה את פרטי המשימה "${args.taskTitle}".</span><br><br>
		<span>לינק ישיר למשימה: <a href="${args.taskLink}" target="_blank" rel="noopener">${args.taskLink}</a></span>
		`;

	},

	notifyVolunteersOfTaskCompletion: function(args){

		return `
		<span>לידיעתך - היוזמה "<a href="${args.groupLink}" target="_blank" rel="noopener">${args.groupDisplayName}</a>" סימנה שהמשימה שהתנדבת אליה - "${args.taskTitle}" - הושלמה!</span><br><br>
		<span>במערכת מכאן יש עוד הרבה משימות והזדמנויות להתנדב - <a href="${urls.domain}/tasks" target="_blank" rel="noopener">עמוד המשימות</a>.</span>
		`;

	},

	notifyVolunteersOfTaskCancelation: function(args){

		return `
		<span>לידיעתך - היוזמה "<a href="${args.groupLink}" target="_blank" rel="noopener">${args.groupDisplayName}</a>" סימנה שהמשימה שהתנדבת	 אליה - "${args.taskTitle}" - בוטלה!</span><br><br>
		<span>במערכת מכאן יש עוד הרבה משימות והזדמנויות להתנדב - <a href="${urls.domain}/tasks" target="_blank" rel="noopener">עמוד המשימות</a>.</span>
		`;

	}

};

module.exports = (templateName, args) => wrap(templates[templateName](args));
module.exports.templateNames = Object.keys(templates);

function wrap(content){

	var styles = `
	<style>
		.container {
			direction: rtl;
			max-width: 700px;
			margin: auto;
			padding: 0 20px 20px;
		}

		.header {
			font-weight: bold;
			background-color: white;
			text-align: center;
			font-size: 32px;
			margin: 20px auto 20px;
			padding-bottom: 25px;
			color: #F5BF36;
		}\

		.main {
			font-size: 16px;
			color: #707070;
		}

		.footnotes {
			padding-top: 75px;
			font-size: 13px;
			color: #a3a3a3;
		}
	</style>
	`;

	var wrapperStart = `
	<div class="container">
		<div class="header">מכאן</div>
		<div class="main">
	`;

	var wrapperEnd = `
		</div>
		<div class="footnotes">
			<p>במידה ואינכם יודעים במה מדובר - ניתן להתעלם ממייל זה.</p>
			<p>אך אם הבעייה חוזרת על עצמה - אנא, פנו לכתובת - <a href="mailto:${urls.supportAddress}">${urls.supportAddress}</a></p>
		</div>
	</div>
	`;

	return styles + wrapperStart + content + wrapperEnd;
}