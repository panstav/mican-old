(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

window.ga('create', 'ANALYTICS_KEY', 'auto');
window.ga('set', 'forceSSL', true);

module.exports = [analytics];

function analytics(){

	return {

		setUser: function(userID){
			window.ga('set', 'userId', userID);
		},

		page: function(data){
			if (location.host !== 'www.darkenu.net') return false;

			window.ga('send', 'pageview', data);
		}
		
	};
}