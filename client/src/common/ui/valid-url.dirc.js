module.exports = [validUrl];

function validUrl(){

	return {

		restrict: 'A',

		template: 'כתובת אינטרנט תקינה תתחיל ב- ' +
		          '<span style="font-style: italic; direction: ltr; display: inline-block;">\'http://\'</span> או ב- ' +
		          '<span style="font-style: italic; direction: ltr; display: inline-block;">\'https://\'</span>.'

	}

}
