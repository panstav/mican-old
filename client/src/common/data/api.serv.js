module.exports = ['$rootScope', '$state', '$http', '$upload', 'httpErrorHandler', 'mem', 'confirmer', 'modal', 'pars', 'buildUrl', api];

function api($rootScope, $state, $http, $upload, httpErrorHandler, mem, confirmer, modal, pars, buildUrl){

	return {

		recall: function(successCallback){
			$http.get('api/recall').success(successCallback).error(httpErrorHandler);
		},

		addToNewsletter: function(data){

			$http.post('api/add-to-newsletter', data)

				.success(
				function(){
					$rootScope.$broadcast('prompt:success', 'מייל אישור נשלח לכתובת - ' + data.email);
				})

				.error(
				function(data){
					$rootScope.$broadcast('prompt:error', data.prompt || 'הוספת כתובת המייל לרשימת התפוצה - נכשלה.');
				})

		},

		admin: {

			updateGroupCategory: data => {

				$http.put('api/admin/group-category', data)

					.success(
						function(){
							$rootScope.$broadcast('prompt:success', 'קטגוריית הקבוצה נשמרה בהצלחה.');

							$state.go($state.current, {}, { reload: true });
						})

					.error(
						function(){
							$rootScope.$broadcast('prompt:error', 'שמירת הקטגורייה - נכשלה.');
						});

			},

			updateGroupNamespace: data => {

				$http.put('api/admin/group-namespace', data)

					.success(
						function(){
							$rootScope.$broadcast('prompt:success', 'הכתובת החדשה של הקבוצה באתר נשמרה בהצלחה.');

							$state.go($state.current, { groupID: data.newNamespace }, { reload: true });
						})

					.error(
						function(){
							$rootScope.$broadcast('prompt:error', 'שמירת הכתובת החדשה של הקבוצה באתר - נכשלה.');
						});

			},

			authorizeGroup: data => {

				$http.post('api/admin/group-authorize', data)

					.success(
						function(){
							$rootScope.$broadcast('prompt:success', 'הקבוצה אושרה בהצלחה.');

							$state.go($state.current, {}, { reload: true });
						})

					.error(
						function(){
							$rootScope.$broadcast('prompt:error', 'אישור הקבוצה - נכשל.');
						});

			}

		},

		users: {

			updateInitials: function(data, callback){

				$http.patch('api/users/initials', data)

					.success(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:success', 'פרטייך נשמרו בהצלחה.');

						callback();
					})

					.error(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:error', 'מסיבה כלשהי שמירת הפרטים נכשלה.');

					});

			},

			loginByMail: function(address){

				$http.post('auth/login-by-mail', { address: address }).success(function(){

					mem('continuousRedirection', window.location.href);
					mem('userEmail', address);

					modal.reset();
					$rootScope.$broadcast('prompt:success', 'מייל התחברות יגיע אלייך בעוד כמספר שניות.');

				}).error(function(){

					modal.reset();
					$rootScope.$broadcast('prompt:error', 'קרתה שגיאה במהלך שליחת המייל, נסו שוב מאוחר יותר.');

				});

			},

			sendConfirmationEmail: function(){
				$http.get('api/users/send-confirmation-email').success(function(){

					// make sure user gets back to current page on reload
					mem('continuousRedirection', window.location.href);

					modal.reset();
					$rootScope.$broadcast('prompt:success', 'מייל אישור נשלח בהצלחה.');

				}).error(function(){

					modal.reset();
					$rootScope.$broadcast('prompt:error', 'קרתה שגיאה במהלך שליחת המייל, נסו שוב מאוחר יותר.');

				})
			},

			logout: function(){

				$http.get('api/users/logout').success(function(){
					window.location.reload();
				});

			},

			getNewFaces: function(successCallback){

				$http.get('api/users/new-faces').success(successCallback).error(httpErrorHandler);

			}

		},

		groups: {

			star: function(data, successCallback){

				$http.post('api/groups/star', { groupIdToStar: data.groupID }).success(successCallback).error(httpErrorHandler);

			},

			getAll: function(success){

				return $http.get('api/groups/').success(success).error(httpErrorHandler);

			},

			create: function(data, successCallback){

				$http.post('api/groups', data)

					.success(
					function(groupObj){

						modal.reset();

						if (groupObj._id){
							$state.go('singleGroup', { groupID: groupObj._id });

						} else {
							$rootScope.$broadcast('prompt:success', 'היוזמה נוספה למאגר בהצלחה.');
						}

						successCallback(groupObj);
					})

					.error(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:error', 'מסיבה כלשהי הוספת היוזמה נכשלה.');

					});

			},

			suggest: function(data, callback){

				$http.post('api/groups/suggest', data)

					.success(
						function(){
							$rootScope.$broadcast('prompt:success', 'תודה רבה, במידה ונמצא את היוזמה מתאימה - ניצור עימה קשר בקרוב.');

							callback();
						})

					.error(
						function(){
							$rootScope.$broadcast('prompt:error', 'שמירת פרטי היוזמה נכשלה מסיבה מסויימת, נסו שוב מאוחר יותר.');

							callback();
						});

			},

			getAdminEmail: function(id, successCallback){

				$http.get('api/groups/' + id + '/admin-email').success(successCallback).error(httpErrorHandler);

			},

			updateDesc: function(data){

				$http.put('api/groups/desc', data)

					.success(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:open', {
							message: 'תיאור היוזמה נשמר בהצלחה.',
							backgroundColor: '#79F583',
							color: 'white',
							fa: 'check'
						});

						$state.go($state.current, {}, { reload: true });
					})

					.error(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:error', 'שמירת תיאור היוזמה נכשלה.');

					});

			},

			removeContact: function(data){

				$http.delete('api/groups/' + data.groupID + '/contacts/' + data.contactID)

					.success(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:success', 'איש הקשר נמחק בהצלחה.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						modal.reset();
						$rootScope.$broadcast('prompt:error', 'מחיקת איש הקשר נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			},

			updateContact: function(data){

				$http[data.method]('api/groups/contacts', data.contactObj)

					.success(
					function(){

						$rootScope.$broadcast('prompt:success', 'איש הקשר נשמר בהצלחה.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						$rootScope.$broadcast('prompt:error', 'שמירת איש הקשר נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			},

			updateEvent: function(data){

				$http[data.method]('api/groups/events', { groupID: data.groupID, event: data.eventObj })

					.success(
					function(){

						$rootScope.$broadcast('prompt:success', 'האירוע נשמר בהצלחה.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						$rootScope.$broadcast('prompt:error', 'שמירת האירוע נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			},

			removeEvent: function(data){

				confirmer('removeEvent', function(){

					$http.delete('api/groups/' + data.groupID + '/events/' + data.eventID)

						.success(
						function(){

							$rootScope.$broadcast('prompt:success', 'האירוע נמחק בהצלחה.');
							$state.go($state.current, {}, { reload: true });

						})

						.error(
						function(){

							$rootScope.$broadcast('prompt:error', 'מחיקת האירוע נכשלה.');
							$state.go($state.current, {}, { reload: true });

						});

				});

			},

			getPending: function(successCallback){

				$http.get('api/groups/pending').success(successCallback).error(httpErrorHandler);

			},

			updateLinks: function(data){

				$http.put('api/groups/links', data)

					.success(
					function(){

						$rootScope.$broadcast('prompt:success', 'הלינקים נשמרו בהצלחה.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						$rootScope.$broadcast('prompt:error', 'שמירת הלינקים נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			}

		},

		tasks: {

			list: function(data, successCallback){

				$http.get('api/tasks?' + pars.buildQuery(data)).success(successCallback).error(httpErrorHandler);

			},

			sendTask: function(method, data){

				var sendDataObj = method === 'put' ? data.task : data;

				$http[method]('api/tasks' + (method === 'put' ? ('/' + data.taskID) : ''), sendDataObj)

					.success(
					function(data){

						if (method === 'put'){
							$state.go($state.current, {}, { reload: true });

						} else {
							$state.go('singleGroup', { groupID: data.groupID, taskid: data.newTaskID }, { reload: true });
						}

						$rootScope.$broadcast('prompt:success', 'המשימה נשמרה בהצלחה.');
					})

					.error(
					function(){

						$state.go($state.current, {}, { reload: true });
						$rootScope.$broadcast('prompt:error', 'שמירת המשימה נכשלה.');

					});

			},

			getDetails: function(data, successCallback){

				var url = 'api/tasks/' + data.taskID;

				if (data.volunteerTokens && $state.is('singleGroup')){
					url = buildUrl(url, 'volunteertokens', 'true');
				}

				if ($state.is('tasks')){
					url = buildUrl(url, 'createdbytoken', 'true');
				}

				$http.get(url).success(successCallback).error(
					function(){
						$state.go($state.current, {}, {reload: true});
					}
				);

			},

			volunteer: function(data){

				$http.post('api/tasks/' + data.taskID + '/volunteer', { message: data.message }).success(function(){

					$rootScope.$broadcast('prompt:success', 'התנדבותך נשמרה בהצלחה.');
					$state.go($state.current, {}, { reload: true });

				}).error(function(data){

					if (data.alreadyVolunteered){
						$rootScope.$broadcast('prompt:error', 'התנדבותך כבר רשומה במערכת.');
						modal.reset();

					} else {
						$rootScope.$broadcast('prompt:error', 'שמירת ההתנדבות נכשלה.');
						$state.go($state.current, {}, { reload: true });
					}
				});

			},

			anonVolunteer: function(data){

				$http.post('api/tasks/' + data.taskID + '/anon-volunteer', data.anonVolunteer)

					.success(
					function(){

						$rootScope.$broadcast('prompt:success', 'התנדבותך נשמרה בהצלחה.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						$rootScope.$broadcast('prompt:error', 'שמירת ההתנדבות נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			},

			completeTask: function(data){

				$http.post('api/tasks/' + data.taskID + '/complete', data)

					.success(
					function(){

						$rootScope.$broadcast('prompt:success', 'אדיר.');
						$state.go($state.current, {}, { reload: true });

					})

					.error(
					function(){

						$rootScope.$broadcast('prompt:error', 'השלמת המשימה נכשלה.');
						$state.go($state.current, {}, { reload: true });

					});

			},

			removeTask: function(data){

				confirmer('removeTask', function(){

					$http.delete('api/tasks/' + data.taskID)

						.success(
						function(){

							$rootScope.$broadcast('prompt:success', 'המשימה נמחקה.');
							$state.go($state.current, {}, { reload: true });

						})

						.error(
						function(){

							$rootScope.$broadcast('prompt:error', 'מחיקת המשימה נכשלה.');
							$state.go($state.current, {}, { reload: true });

						});

				});

			}
		},

		track: {

			searchTerm: function(data){
				$http.post('api/track/search-term', data).success(angular.noop);
			}

		},

		upload: function(file, type, data, successfulCallback, failedCallback){

			//-=======================================================---
			//------------------ Validation
			//-=======================================================---

			if (angular.isFunction(data)){
				successfulCallback = data;
				data = {};
			}

			successfulCallback = successfulCallback || angular.noop;
			failedCallback = failedCallback || httpErrorHandler;

			//-=======================================================---
			//------------------ Init
			//-=======================================================---

			var uploadOptions = {
				url: 'upload/' + type,
				method: 'post',
				data: data,
				file: file
			};

			$upload.upload(uploadOptions).success(successfulCallback).error(failedCallback);

		},

		feedback: function(data){

			$http.post('api/feedback/', data)

				.success(
				function(){

					$rootScope.$broadcast('prompt:success', 'הפידבק שלך נשמר בהצלחה.');
					$state.go($state.current, {}, { reload: true });

				})

				.error(
				function(){

					$rootScope.$broadcast('prompt:error', 'שמירת הפידבק נכשלה.');
					$state.go($state.current, {}, { reload: true });

				});

		}
	}
}