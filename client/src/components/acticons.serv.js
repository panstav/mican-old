module.exports = [acticons];

function acticons(){

	var acticonList = [];

	return {

		reset: function(){

			acticonList = acticonList.filter(function(acticon){
				return !!acticon.permanent;
			});

		},

		addPermanent: function(acticons){

			if (angular.isArray(acticons)){

				acticons.forEach(function(acticon){
					acticon.permanent = true;

					assign(acticon);
				});

			} else if (angular.isObject(acticons)) {
				acticons.permanent = true;

				assign(acticons);
			}
		},

		addForState: function(acticons){

			if (angular.isArray(acticons)){
				acticons.forEach(function(acticon){
					assign(acticon);
				});

			} else if (angular.isObject(acticons)){
				assign(acticons);
			}
		},

		get list(){
			return acticonList;
		}

	};

	function assign(acticon){

		if (acticon.toggle){
			var acticonAction = acticon.action;

			acticon.action = function(){
				acticon.toggled = !acticon.toggled;

				acticonAction();
			};

			if (acticon.init) acticon.toggled = acticon.init;
		}

		delete acticon.toggle;
		delete acticon.init;

		acticonList.push(acticon);
	}

}