module.exports = ['api', 'mem', groups];

function groups(api, mem){

	var memKey = 'entireGroupsArray';
	var maxAge = 60 * 15 * 1000; // 15 minutes

	return {

		getAll: function(callback){

			callback = callback || angular.noop;

			// check localStorage for groups
			var groups = mem(memKey, null, { keep: true });

			// getEm if no stored groups or their past due
			if (!groups || !groups.list || Date.now() > groups.downloadedAt + maxAge){

				return api.groups.getAll(function(groups){
					mem(memKey, {
						list: groups,
						downloadedAt: Date.now()
					});

					callback(groups);
				});

			}

			return callback(groups.list);

		}

	}

}