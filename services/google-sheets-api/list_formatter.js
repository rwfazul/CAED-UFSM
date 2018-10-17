var formatter = require('./formatter');

function listFormat(result) {
	var matrix = [];

	if (result.length) { 
		for (var row = 0; row < result.length; row++) {
			var v = [];
			for (var col = 1; col < 12; col++) {
				v.push(result[row][col]);
			};
			matrix.push(v);
		};
	}
	matrix.push(formatter(result));
	return matrix;
}

module.exports = listFormat;