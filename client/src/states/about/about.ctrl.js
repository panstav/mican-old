module.exports = [controller];

function controller(){

	this.shareText = 'שמעתם על הדבר הזה - \'מכאן\' ?';

	this.contributers = [
		'תום בזרוקוב',
		'חמי שטורמן',
		'אסף בז\'רנו',
		'מיכל לה',
		'אנו',
		'אוסו באיו',
		'יוס ברוך',
		'ניר שוחן',
		'אהרן פורת',
		'דויד ענבר',
		'אורי פורת',
		'זיוה אפרים'
	];

	this.mainTechnologies = [
		{
			title: 'NodeJS',
			url: 'https://nodejs.org/',
			desc: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js\' package ecosystem, npm, is the largest ecosystem of open source libraries in the world.'
		},{
			title: 'AngularJS',
			url: 'https://angularjs.org/',
			desc: 'A toolset for building the framework most suited to your application development. It is fully extensible and works well with other libraries. '
		},{
			title: 'Express',
			url: 'http://expressjs.com/',
			desc: 'A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.'
		},{
			title: 'MongoDB',
			url: 'https://www.mongodb.org/',
			desc: 'A next-generation database that lets you create applications never before possible.'
		},{
			title: 'Heroku',
			url: 'https://www.heroku.com/',
			desc: 'A cloud platform based on a managed container system, with integrated data services and a powerful ecosystem, for deploying and running modern apps.'
		},{
			title: 'Cloudinary',
			url: 'http://cloudinary.com/',
			desc: 'An image back-end for web and mobile developers. An end-to-end solution for all your image-related needs.'
		},{
			title: 'MailChimp',
			url: 'http://mailchimp.com/',
			desc: 'Online email marketing solution to manage contacts, send emails and track results. Offers plug-ins for other programs.'
		},{
			title: 'Google Analytics',
			url: 'https://www.google.com/analytics/',
			desc: 'Mobile, Premium and Free website analytics.'
		},{
			title: 'PassportJS',
			url: 'http://passportjs.org/',
			desc: 'An authentication middleware for Node.js. Extremely flexible and modular, Passport can be unobtrusively dropped in to any Express-based web application.'
		},{
			title: 'Font Awesome',
			url: 'https://fortawesome.github.io/Font-Awesome/',
			desc: 'A set of scalable vector icons that can instantly be customized — size, color, drop shadow, and anything that can be done with the power of CSS.'
		}
	];

	// that's a hook replaced by actual package.json dependencies @ gulpfile.js - webpack
	this.restTechnologies = PACKAGE.JSON_FILTERED_DEPENDENCIES;

}