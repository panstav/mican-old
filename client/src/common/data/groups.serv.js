module.exports = ['api', 'mem', groups];

function groups(api, mem){

	var memKey = 'entireGroupsArray';
	var maxAge = 60 * 60 * 24 * 1000;

	return {

		getAll: function(callback){

			callback = callback || angular.noop;

			// check localStorage for groups
			var groups = mem(memKey, null, { keep: true });

			// getEm if no stored groups or their past due
			if (!groups || !groups.list || Date.now() - maxAge > groups.downloadedAt){

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