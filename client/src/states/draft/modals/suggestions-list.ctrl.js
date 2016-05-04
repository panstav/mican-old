module.exports = ['mem', 'calcDelta', 'numberOf', controller];

function controller(mem, calcDelta, numberOf){

	const ctrl = this;

	this.paraData = mem('paraData') || {};
	this.suggestions = mem('paraSuggestions', null, { scoped: true }) || {};

	this.extraDetails = 'original';

	this.numberOfSuggestions = function(){
		return numberOf({ singular: 'הצעה אחת', plural: 'הצעות' }, ctrl.suggestions, 'הוסף הצעה')
	};

	const debouncedDeltaFetch = debounce(() => {
		calcDelta(ctrl.paraData.content, ctrl.newPara.content)
			.then(delta => { ctrl.newChanges = delta; })
			.catch(console.log.bind(console))
			.finally(() => { ctrl.loadingDelta = false; console.log('loading off'); });
	}, 1500);

	this.updateDelta = () => {
		ctrl.loadingDelta = true;
		console.log('loading on');

		debouncedDeltaFetch();
	};

	this.newPara = {
		content: ctrl.paraData.content
	};

	function debounce(func, wait, immediate) {

		let timeout;

		return function(){

			const context = this;
			const args = arguments;

			const later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};

			const callNow = immediate && !timeout;

			clearTimeout(timeout);

			timeout = setTimeout(later, wait);

			if (callNow) func.apply(context, args);

		};
	};

}