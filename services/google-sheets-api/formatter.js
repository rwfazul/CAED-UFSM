/* TODO: REFATORAR 
extractor.getSheetData(sheets.salas, function(result, err) {
	if (err) return errorHandler(err);
		var header = result[0];
		result.shift();
		result.map(function(item, index) {
		    console.log(item);
		    console.log('index', index);
		    // ...
		});
}); */

function formatResult(result) {
	var nomes = [];
	var h1 = [];
	var h2 = [];
	var h3 = [];
	var h4 = [];
	var h5 = [];
	var h6 = [];
	var h7 = [];
	var h8 = [];
	var h9 = [];
	var h10 = [];
	var matrix = [];

	if (result.length) {
		for (var row = 0; row < result.length; row++) {
			for (var col = 0; col < result[row].length; col++) {
				switch (result[0][col]) {
					case "Nome completo":
						nomes[row] = result[row][col];
						break;
					case "Nome sala":
						nomes[row] = result[row][col];
						break;
					case "Horários livres [08h - 09h]":
						h1[row] = result[row][col].split(",");
						break;
					case "Horários livres [09h - 10h]":
						h2[row] = result[row][col].split(",");
						break;
					case "Horários livres [10h - 11h]":
						h3[row] = result[row][col].split(",");
						break;
					case "Horários livres [11h - 12h]":
						h4[row] = result[row][col].split(",");
						break;
					case "Horários livres [13h - 14h]":
						h5[row] = result[row][col].split(",");
						break;
					case "Horários livres [14h - 15h]":
						h6[row] = result[row][col].split(",");
						break;
					case "Horários livres [15h - 16h]":
						h7[row] = result[row][col].split(",");
						break;
					case "Horários livres [16h - 17h]":
						h8[row] = result[row][col].split(",");
						break;
					case "Horários livres [17h - 18h]":
						h9[row] = result[row][col].split(",");
						break;
					case "Horários livres [18h - 19h]":
						h10[row] = result[row][col].split(",");
						break;
				}
			}
		}
		matrix.push(nomes);
		matrix.push(arrayDaysBoolean(h1));
		matrix.push(arrayDaysBoolean(h2));
		matrix.push(arrayDaysBoolean(h3));
		matrix.push(arrayDaysBoolean(h4));
		matrix.push(arrayDaysBoolean(h5));
		matrix.push(arrayDaysBoolean(h6));
		matrix.push(arrayDaysBoolean(h7));
		matrix.push(arrayDaysBoolean(h8));
		matrix.push(arrayDaysBoolean(h9));
		matrix.push(arrayDaysBoolean(h10));

		/*
		for (var row = 0; row < matrix.length; row++) {
			for (var col = 0; col < matrix[row].length; col++) {
				console.log("Linha ", row, "Coluna ", col, ":", matrix[row][col]);
			}
		}*/
		constraints = createArrayObjects(nomes, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10);
		matrix.push(constraints);


	}
	return matrix;
}

function arrayDaysBoolean(array) {
	var a = [array[0]];
	for (var r = 1; r < array.length; r++) {
		var v = [false, false, false, false, false];
		if((typeof(array[r]) != "undefined")){
			array[r].forEach((c) => {
				if (c.includes("Segunda-feira"))
					v[0] = true;
				if (c.includes("Terça-feira"))
					v[1] = true;
				if (c.includes("Quarta-feira"))
					v[2] = true;
				if (c.includes("Quinta-feira"))
					v[3] = true;
				if (c.includes("Sexta-feira"))
					v[4] = true;
			});
		}
		a[r] = v;
	}
	return a;
}

function createArrayObjects(nomes, h1, h2, h3, h4, h5, h6, h7, h8, h9, h10) {
	var objects = [];
	objects.push('constraints');
	for (var r = 1; r < nomes.length; r++) {
		var disp = [];
		disp.push(createObjects(nomes[r], "08:00", arrayDaysInt(h1)[r]));
		disp.push(createObjects(nomes[r], "09:00", arrayDaysInt(h2)[r]));
		disp.push(createObjects(nomes[r], "10:00", arrayDaysInt(h3)[r]));
		disp.push(createObjects(nomes[r], "11:00", arrayDaysInt(h4)[r]));
		disp.push(createObjects(nomes[r], "13:00", arrayDaysInt(h5)[r]));
		disp.push(createObjects(nomes[r], "14:00", arrayDaysInt(h6)[r]));
		disp.push(createObjects(nomes[r], "15:00", arrayDaysInt(h7)[r]));
		disp.push(createObjects(nomes[r], "16:00", arrayDaysInt(h8)[r]));
		disp.push(createObjects(nomes[r], "17:00", arrayDaysInt(h9)[r]));
		disp.push(createObjects(nomes[r], "18:00", arrayDaysInt(h10)[r]));
		objects.push(disp);
	}
	return objects;
}

function createObjects(nome, hour, days) {
	var object = {};
	object.id = nome;
	object.start = hour;
	object.duration = "01:00";
	object.rendering = "inverse-background";
	object.dow = days;
	object.color = '#ff9f89'
	return object;
}

function arrayDaysInt(array) {
	var a = [];
	for (var r = 1; r < array.length; r++) {
		var v = [];
		if((typeof(array[r]) != "undefined")){
			array[r].forEach((c) => {
				if (c.includes("Segunda-feira"))
					v.push(1);
				if (c.includes("Terça-feira"))
					v.push(2);
				if (c.includes("Quarta-feira"))
					v.push(3);
				if (c.includes("Quinta-feira"))
					v.push(4);
				if (c.includes("Sexta-feira"))
					v.push(5);
			});
		}
		a[r] = v;
	}
	return a;
}

module.exports = formatResult;