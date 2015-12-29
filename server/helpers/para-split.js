module.exports = function(paragraphs){

	// split text into lines
	var lines = paragraphs.split('\n');

	// remove empty lines
	for (var i = 0; i < lines.length; i++){
		
		if (lines[i] === ''){
			lines.splice(i, 1);
			i--;
		}
		
	}

	return lines;
};
