module.exports = ['store', mem];

function mem(store){

	// this is a tiny wrapper for [angular-storage](https://github.com/auth0/angular-storage)

	// all it does is:
	// 1) auto-remove the stored value after first withdrawal
	// 2) enables calling mem with an object and key-value pairs, which the service them iterates over and save individually

	return function(key, value, options){

		if (!key) return false;

		options = options || {};

		if (angular.isString(key)) return handleStorage(key, value);

		var keys = Object.keys(key);
		for (var i = 0, len = keys.length; i < len; i++){
			handleStorage(keys[i], key[keys[i]]);
		}

		function handleStorage(key, value){

			// a value means storage goes in
			if (value !== undefined && value !== null) return store.set(key, value);

			// otherwise cut the storage at that key
			var temp = angular.copy(store.get(key));
			store.remove(key);

			// optionaly puts it back to refresh (?) it
			if (options.keep) store.set(key, temp);

			// return find
			return temp;
		}

	};

}