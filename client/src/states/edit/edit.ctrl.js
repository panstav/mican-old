module.exports = [controller];

function controller(){

	const ctrl = this;

	this.limit = {
		supports: 2,
		reject: 2
	};
	this.removeLimit = type => {
		ctrl.limit[type] = undefined;
	};

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
				content: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן',
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
				content: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן',
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

	ctrl.shareText = `"${ctrl.title}" - הצעת שינוי מאת ${ctrl.author.displayName}`;
	ctrl.currentUrl = `localhost:3000/edit/${ctrl.id}`;

}

//  {
//
//		title: 'כותרת המסמך',
//			description: 'תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן. תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן. תיאור המסמך, סיבותיו, מטרותיו וכל מיני פרטים רלוונטיים אחרים יכולים להכנס כאן.',
//		participants: 5,
//
//		author: {
//			displayName: 'שם המחבר',
//			avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/suprb/128.jpg'
//		},
//		date: '02.06.16',
//		hour: '12:54',
//
//		content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.\n\nבניגוד לטענה הרווחת, Lorem Ipsum אינו סתם טקסט רנדומלי. יש לו שורשים וחלקים מתוך הספרות הלטינית הקלאסית מאז 45 לפני הספירה. מה שהופך אותו לעתיק מעל 2000 שנה. ריצ\'רד מקלינטוק, פרופסור לטיני בקולג\' של המפדן-סידני בורג\'יניה, חיפש את אחת המילים המעורפלות ביותר בלטינית - consectetur - מתוך פסקאות של Lorem Ipsum ודרך ציטוטים של המילה מתוך הספרות הקלאסית, הוא גילה מקור בלתי ניתן לערעור. Lorem Ipsum מגיע מתוך מקטע 1.10.32 ו- 1.10.33 של "de Finibus Bonorum et Malorum" (הקיצוניות של הטוב והרע) שנכתב על ידי קיקרו ב-45 לפני הספירה. ספר זה הוא מאמר על תאוריית האתיקה, שהיה מאוד מפורסם בתקופת הרנסנס. השורה הראשונה של "Lorem ipsum dolor sit amet", שמופיעה בטקסטים של Lorem Ipsum, באה משורה במקטע 1.10.32\n\nזוהי עובדה מבוססת שדעתו של הקורא תהיה מוסחת על ידי טקטס קריא כאשר הוא יביט בפריסתו. המטרה בשימוש ב-Lorem Ipsum הוא שיש לו פחות או יותר תפוצה של אותיות, בניגוד למלל ונותן חזות קריאה יותר.הרבה הוצאות מחשבים ועורכי דפי אינטרנט משתמשים כיום ב-Lorem Ipsum כטקסט ברירת המחדל שלהם, וחיפוש של \'lorem ipsum\' יחשוף אתרים רבים בראשית דרכם.גרסאות רבות נוצרו במהלך השנים, לעתים בשגגה לעיתים במכוון (זריקת בדיחות וכדומה).\n\nיש המון גרסאות זמינות לפסקאות של Lorem Ipsum. אבל רובם עברו שינויים בצורה זו או אחרת, על ידי השתלת הומור או מילים אקראיות שלא נראות אפילו מעט אמינות. אם אתה הולך להשתמש במקטעים של של Lorem Ipsum אתה צריך להיות בטוח שאין משהו מביך חבוי בתוך הטקסט. כל מחוללי הטקסט של Lorem Ipsum שנמצאים ברשת האינטרנט מכוונים לחזור על טקסטים מוגדרים מראש לפי הנדרש. וזה הופך אותנו למחוללי טקסט אמיתיים ראשונים באינטרנט. אנו משתמשים במילון עם מעל 200 ערכים בלטינית משולבים במבני משפטים על מנת לשוות לטקט מראה הגיוני. ולכן הטקסט של Lorem Ipsum לעולם לא יכיל טקסטים חוזרים, הומור, או מילים לא מאופייניות וכדומה'.split('\n\n'),
//
//		comments: [
//			{
//				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
//				},
//				date: '03.05.16',
//				hour: '17:14',
//				createdAt: new Date('05.03.16')
//			},{
//				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
//				},
//				date: '03.06.15',
//				hour: '17:14',
//				createdAt: new Date('06.03.15')
//			},{
//				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
//				},
//				date: '01.01.16',
//				hour: '17:14',
//				createdAt: new Date('01.01.16')
//			},{
//				content: 'Lorem Ipsum הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16, כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum.',
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/nuraika/128.jpg'
//				},
//				date: '06.06.15',
//				hour: '17:14',
//				createdAt: new Date('06.06.15')
//			}
//		],
//
//		history: [
//			{
//				title: 'כותרת הצעת שינוי',
//				description: 'יש המון גרסאות זמינות לפסקאות של Lorem Ipsum. אבל רובם עברו שינויים בצורה זו או אחרת.',
//				updatedAt: new Date('02.05.2016'),
//
//				changes: [
//					{
//						content: 'יש המון גרסאות זמינות לפסקאות של Lorem Ipsum. ',
//						state: 'remove'
//					}
//				],
//
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/minipunk/128.jpg'
//				},
//				date: '05.02.2016',
//				hour: '10:03'
//			},
//
//			{
//				title: 'כותרת הצעת שינוי שנייה',
//				description: 'תיאור קצר יותר של הצעת השינוי',
//				updatedAt: new Date('02.05.2015'),
//
//				changes: [
//					{
//						para: 1,
//						content: 'יש המון גרסאות זמינות לפסקאות של Lorem Ipsum. ',
//						state: 'remove'
//					}
//				],
//
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/minipunk/128.jpg'
//				},
//
//				date: '05.02.15',
//				hour: '10:03'
//			}
//		],
//
//		suggestions: [
//
//			,
//
//			{
//				title: 'כותרת הצעת שינוי',
//				description: 'יש המון גרסאות זמינות לפסקאות של Lorem Ipsum.',
//				createdAt: new Date('01.03.2016'),
//
//				changes: [
//					{
//						content: 'ודרך ציטוטים',
//						state: 'stay'
//					},{
//						content: ' של המילה',
//						state: 'remove'
//					},{
//						content: ' חדשים',
//						state: 'add'
//					},{
//						content: ' מתוך הספרות הקלאסית',
//						state: 'stay'
//					}
//
//				],
//
//				votes: {
//					for: 38,
//					against: 21
//				},
//
//				author: {
//					displayName: 'שם המחבר',
//					avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/minipunk/128.jpg'
//				},
//				date: '03.01.16',
//				hour: '10:03'
//			}
//
//		],
//
//		counters: {
//			comments: 3,
//			suggestions: 3,
//			history: 3
//		}
//
//	});