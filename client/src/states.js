var states = {

	homepage: {

		url: '/',

		views: {
			'main':{
				template: '<state-homepage></state-homepage>',

				controllerAs: 'homeState',
				controller: ['groupsSum', function(groupsSum){
					this.groupsSum = groupsSum.data.num;
				}]
			}
		},

		resolve: {
			groupsSum: ['$http', 'httpErrorHandler', function($http, httpErrorHandler){

				return $http.get('api/groups-sum').success(function(data){
					return data;
				}).error(httpErrorHandler);

			}]
		},

		seo: {
			title: 'דרכנו - יוזמות חברתיות'
		}

	},

	about: {

		url: '/about',

		views: {
			'main':{
				template: '<state-about></state-about>'
			}
		},

		seo: {
			title: 'דרכנו - אודות המיזם',
			description: 'ברצוננו להעלות אל פני השטח את השינוי הכביר שמתחולל מתחת לפני המסך - להנגיש את הרשת בצורה פשוטה ומעוררת השראה ולהניע לפעולה. כך - אנחנו מקווים - יקודם השינוי המיוחל בסדר היום של מדינת ישראל.'
		}

	},

	groups: {

		url: '/groups?category&modal',

		views: {
			'main':{
				template: '<state-groups></state-groups>'
			}
		},

		seo: {
			title: 'מאגר היוזמות',
			description: 'תקשורת ומידע, שקיפות ומנהל תקין, צדק חברתי, סביבה וטבע, פערים ומגזרים, צרכנות וקואופרטיבים, קהילות וערבות הדדית, הגברת מודעות, מחקר, חשיבה והכשרה.'
		}

	},

	tasks: {

		url: '/tasks',

		views: {
			'main':{
				template: '<state-tasks></state-tasks>'
			}
		},

		seo: {
			title: 'מאגר המשימות',
			description: 'קריאות לפעולה בהתנדבות ובשיתוף עם יוזמות חברתיות'
		}

	},

	singleGroup: {

		url: '/groups/:groupID?taskid',

		views: {
			'main':{
				template: '<state-single-group></state-single-group>',

				controllerAs: 'singleGroupState',
				controller: ['group', function(group){
					this.group = group.data;
				}]
			}
		},

		params: {
			editingMode: { value: false }
		},

		resolve: {
			group : ['$rootScope', '$http', 'httpErrorHandler', '$state', '$stateParams', 'user', 'modal', function($rootScope, $http, httpErrorHandler, $state, $stateParams, user, modal){

				return $http.get('api/groups/' + $stateParams.groupID).success(yeaCB).error(nahCB);

				function yeaCB(group){
					return group;
				}

				function nahCB(data){

					if (data.groupHasNamespace) return $state.go('singleGroup', { groupID: data.groupHasNamespace });

					if (data.pending){

						if (user.isAnon()){

							// probably a group admin without auth
							modal.open('login');

						} else {

							// probably got a link before group got approved
							$rootScope.$broadcast('prompt:error', 'היוזמה לא סיימה עוד את תהליך ההרשמה.');
						}

						// either way, don't stay on this profile
						return $state.go('groups');
					}

					if (data.noSuchGroup || data.blocked){

						$rootScope.$broadcast('prompt:error', data.noSuchGroup ? '.היוזמה לא נמצאה במאגר.' : 'היוזמה נחסמה.');
						$state.go('groups');

					}

				}

			}]
		}
	},

	polimap: {

		url: '/map',

		views: {
			'main':{
				template: '<iframe src="/polimap/index.html" style="border: 0; background-color: #231F20; padding: 3em 0; position: fixed; top: 0; bottom: 0; left: 0; right: 0; width: 100%; height: 100%;"></iframe>'
			}
		},

		seo: {
			title: 'מפת היוזמות והאירגונים במאבק החברתי - אוקטובר \'14'
		}

	}

};

module.exports = ['$stateProvider', '$locationProvider', '$urlRouterProvider', registerStates];

function registerStates($stateProvider, $locationProvider, $urlRouterProvider){

	$locationProvider.html5Mode(true);

	// register every state
	for (var stateName in states){
		$stateProvider.state(stateName, states[stateName]);
	}

	// fallback to homepage
	$urlRouterProvider.otherwise("/");
}