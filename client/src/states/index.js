module.exports = {

	homepage: {

		url: '/',

		views: {
			'main':{
				template: '<state-homepage></state-homepage>'
			}
		},

		seo: {
			title: 'מכאן - יוזמות חברתיות'
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
			title: 'מכאן - אודות המיזם',
			description: 'ברצוננו להעלות אל פני השטח את השינוי הכביר שמתחולל מתחת לפני המסך - להנגיש את הרשת בצורה פשוטה ומעוררת השראה ולהניע לפעולה. כך - אנחנו מקווים - יקודם השינוי המיוחל בסדר היום של מדינת ישראל.'
		}

	},

	groups: {

		url: '/groups?category',

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

	draft: {

		url: '/draft/:draftId',

		views: {
			'main':{
				template: '<state-draft></state-draft>'
			}
		}

	},

	draftEdit: {

		url: '/edit/:editId',

		views: {
			'main':{
				template: '<state-edit></state-edit>'
			}
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
