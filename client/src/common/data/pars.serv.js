module.exports = [pars];

function pars(){

	var currentYear = new Date().getFullYear();

	return {

		buildQuery: function(data){
			return Object.keys(data).map(function(key){
				return [key, data[key]].map(encodeURIComponent).join("=");
			}).join("&");
		},

		dates: {
			days: fillInNumbers(31),
			months: fillInNumbers(12),
			monthStrings: ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'],
			years: [ currentYear, currentYear+1 ],
			hours: fillInNumbers(23),
			minutes: ['00', '15', '30', '45'],

			numberOfDays: function(year, month){
				var d = new Date(year, month, 0);
				return d.getDate();
			},

			daysInMonthValidation: function(year, month, day){
				if (!year || !month || !day) return false;

				return day <= this.numberOfDays(year, month);
			},

			futureDateValidation: function(year, month, day){
				if (!year || !month || !day) return false;

				var currentDate = new Date();

				var currentDateObj = {
					year: currentDate.getFullYear(),
					month: currentDate.getMonth() + 1,
					day: currentDate.getDate()
				};

				if (year < currentDateObj.year) return false;

				if (year !== currentDateObj.year) return true;

				if (month < currentDateObj.month) return false;

				if (month === currentDateObj.month) return day > currentDateObj.day;

				return true;

			},

			formatDate: function(year, month, day, hour, minutes){

				var formattedStr = addZero(day) + '/' + addZero(month) + '/' + year;

				return hour ? (formattedStr + " " + addZero(hour) + ':' + (minutes || '00')) : formattedStr;

				function addZero(num){
					return num < 10 ? (0 + "" + num) : num;
				}

			},

			parseDate: function(dateStr){

				return {
					day: parseInt(dateStr.substr(0, 2), 10),
					month: parseInt(dateStr.substr(3, 2), 10),
					year: parseInt(dateStr.substr(6, 4), 10),
					hour: parseInt(dateStr.substr(11, 2), 10) || false,

					// this one stays a string to keep the '00'
					minutes: dateStr.substr(14, 2) || false
				};

			}

		},

		trimMax: function(str, max){
			return str.length > max ? str.substr(0, max) + '...' : str;
		},

		groupCategoriesByColor: {
			orange: 'תקשורת ומידע',
			purple: 'שקיפות ומנהל תקין',
			blue:   'צדק חברתי',
			green:  'סביבה וטבע',
			aqua:   'פערים ומגזרים',
			yellow: 'צרכנות וקואופרטיבים',
			bordo:  'קהילות וערבות הדדית',
			sky:    'הגברת מודעות',
			pink:   'מחקר, חשיבה והכשרה'
		},

		engCategoriesByColor: {
			orange: 'communication',
			purple: 'transparency',
			blue:   'justice',
			green:  'environment',
			aqua:   'demographics',
			yellow: 'cooperatives',
			bordo:  'communal',
			sky:    'awareness',
			pink:   'guidance'
		},

		hexColorByName: {
			orange:    '#f7921e',
			purple:    '#B06BE2',
			blue:      '#90BAC7',
			green:     '#71BF45',
			aqua:      '#00B0F0',
			yellow:    '#D5B463',
			bordo:     '#F1553E',
			sky:       '#01B9BB',
			pink:      '#D14B7D'
		},

		contactChannels: {
			mail: 'כתובת אימייל',
			tel:  'מספר טלפון',
			link: 'כתובת אינטרנט'
		},

		contactChannelFaClass: {
			mail: 'envelope',
			tel:  'phone',
			link: 'external-link'
		},

		formatLinkProtocol: function(channel, href){
			var prefixes = {
				mail: 'mailto:',
				tel: 'tel:',
				link: ''
			};

			return prefixes[channel] + href;
		},

		webOrFacebookIcon: function(linkStr){
			return iconPerExternalLinks(linkStr);
		},

		publicityTypes: [
			{
				id: 1,
				name: 'public',
				text: 'ציבורי'
			},{
				id: 2,
				name: 'registered',
				text: 'משתמשים רשומים'
			},{
				id: 3,
				name: 'followers',
				text: 'משתמשים עוקבים'
			}
		],

		fontAwesomeClassByPlatform: fontAwesomeClass,

		squaredFontAwesomeClassByPlatform: function(platform){
			var nonSquared = fontAwesomeClass(platform);

			return platform.match('home') ? nonSquared : nonSquared + '-square';
		},

		linkTitleByPlatform: function(platform, displayName){
			var hebProp = 'עמוד ה';

			hebProp += getHebrewPlatformName(platform);

			return hebProp + ' של ' + displayName;
		}

	};

}

function fillInNumbers(topEnd){
	var arr = [];

	for (var i = 0, len = topEnd; i < len; i++){
		arr.push(i + 1);
	}

	return arr;
}

function iconPerExternalLinks(linkStr, defaultIcon){

	if (!linkStr) return '';

	if (linkStr.substr(0, 20).indexOf('facebook') > -1) return 'fa-facebook-square';

	return defaultIcon || 'fa-external-link';

}

function getHebrewPlatformName(platform){
	switch (platform){

	case 'homepage':
		return 'בית';
		break;

	case 'facebook':
		return 'פייסבוק';
		break;

	case 'twitter':
		return 'טוויטר';
		break;

	case 'google':
		return 'גוגל+';
		break;
	}
}

function fontAwesomeClass(platform){
	if (platform === 'homepage') platform = 'home';

	if (platform === 'google') platform += '-plus';

	return 'fa-' + platform;
}