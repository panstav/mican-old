module.exports = ['$q', '$http', service];

function service($q, $http){

	return (from, to) => {

		return $q((resolve, reject) => {
			return $http({ method: 'POST', url: '/api/delta', data: { from, to } })
				.then(resp => resolve(resp.data), reject);
		});

	};

}