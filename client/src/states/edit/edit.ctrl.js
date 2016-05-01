module.exports = [controller];

function controller(){

	const ctrl = this;

	angular.extend(ctrl, {

		id: '123',
		title: 'כותרת הצעת השינוי',

		author: {
			displayName: 'שם המחבר',
			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/minipunk/128.jpg'
		},
		date: '01.03.15',
		hour: '10:03',

		draftId: '123',
		draftTitle: 'כותרת המסמך',

		changes: [
			{ para: 1.2, state: 'stay',   content: 'יד ליוזמות חברתיות הפועלות בדרכנו ומשקיעות אנרגיה כה רבה למה שמטיב עם כולנו. כמטרת על - לעת עתה- מכאן שואפת להיות במה מסודרת העונה על ' },
			{ para: 1.5, state: 'stay',   content: ' צרכים בסיסיים ' },
			{ para: 1.3, state: 'remove', content: 'זוג' },
			{ para: 1.7, state: 'stay',   content: '- הנגשת מידע וגיוס משאבים ומתנדבים.' },
			{ para: 1.1, state: 'remove', content: 'היינו רוצים לתת ' },
			{ para: 1.4, state: 'add',    content: 'כמה' },
			{ para: 1.6, state: 'add',    content: 'ביניהם ' }
		],

		description: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן. תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן. תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן.',

		votes: {
			for: 38,
			against: 0
		},

		supports: [
			{
				content: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים',
				votes: {
					up: 4,
					down: 4
				},
				author: {
					displayName: 'צ\'ובקה',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg'
				},
				hour: '19:21',
				date: '15.4.2015',
				comments: [
					{
						author: {
							displayName: 'שם המחבר',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg'
						},
						content: 'כל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן'
					}
				]
			},
			{
				content: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים ',
				votes: {
					up: 4,
					down: 3
				},
				author: {
					displayName: 'צ\'ובקה',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg'
				},
				hour: '19:21',
				date: '15.4.2015',
				comments: [
					{
						author: {
							displayName: 'שם המחבר',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg'
						},
						content: 'כל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן'
					},
					{
						author: {
							displayName: 'שם המחבר',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg'
						},
						content: 'כל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן'
					},
					{
						author: {
							displayName: 'שם המחבר',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg'
						},
						content: 'כל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן'
					}
				]
			},
			{
				content: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים',
				votes: {
					up: 6,
					down: 4
				},
				author: {
					displayName: 'צ\'ובקה',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg'
				},
				hour: '19:21',
				date: '15.4.2015',
				comments: [
					{
						author: {
							displayName: 'שם המחבר',
							avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/adellecharles/128.jpg'
						},
						content: 'כל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן'
					}
				]
			}
		],
		rejects: [
			{
				content: 'סיבה כזו וכז, הסבר כזה ואחר על הסירוב להצעה זו',
				votes: {
					up: 5,
					down: 2
				},
				author: {
					displayName: 'צ\'ובקה',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg'
				},
				hour: '19:21',
				date: '15.4.2015'
			},
			{
				content: 'סירוב פחות נחמד, אבל בצורה שונה מזו האחרת',
				votes: {
					up: 5,
					down: 2
				},
				author: {
					displayName: 'באצ\'וק',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/minipunk/128.jpg'
				},
				hour: '21:19',
				date: '4.2.2016'
			}
		],

		comments: [
			{

				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',

				author: {
					displayName: 'שם המחבר',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
				},

				date: '03.05.16',
				hour: '17:14',
				createdAt: new Date('05.03.16')

			},{

				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',

				author: {
					displayName: 'שם המחבר',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
				},

				date: '03.05.16',
				hour: '17:14',
				createdAt: new Date('05.03.16')

			},{

				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',

				author: {
					displayName: 'שם המחבר',
					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
				},

				date: '03.05.16',
				hour: '17:14',
				createdAt: new Date('05.03.16')

			}
		]

	});

	// edit social sharing options
	this.shareText = `"${ctrl.title}" - הצעת שינוי מאת ${ctrl.author.displayName}`;
	this.currentUrl = `localhost:3000/edit/${ctrl.id}`;

	// limiting numbers of arguments shown
	this.limit = { supports: 2, reject: 2 };
	this.removeLimit = type => {
		ctrl.limit[type] = undefined;
	};

}