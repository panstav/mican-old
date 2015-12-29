module.exports = ['api', tasks];

function tasks(api){

	var ctrl = this;

	this.searchedOnce = false;

	this.sorter = 'createdAt';

	this.applyQuery = function(options){

		options = options || {};

		api.tasks.list(buildTaskQuery(options), function(data){

			ctrl.searchedOnce = true;

			ctrl.tasks = options.skip ? ctrl.tasks.concat(data.tasks) : data.tasks;
			ctrl.lastBatch = data.lastBatch;

			// build explanation of empty list
			if (!ctrl.tasks.length){

				var emptyListPrompt = 'אין כרגע משימות פתוחות במערכת';

				if (ctrl.categoryFilter) emptyListPrompt += ', בקטגורייה שנבחרה';
				if (ctrl.novolunteers) emptyListPrompt += ', שאין להן מתנדבים';

				ctrl.emptyListPrompt = emptyListPrompt + '.';

			}
		});

	};

	this.loadMore = function(){

		ctrl.applyQuery({ skip: ctrl.tasks.length });

	};

	function buildTaskQuery(options){

		var query = {
			sorter: ctrl.sorter
		};

		if (options.skip) query.skip = options.skip || 0;
		if (ctrl.categoryFilter) query.color = ctrl.categoryFilter;
		if (ctrl.novolunteers) query.novolunteers = 'true';

		return query;
	}

}
