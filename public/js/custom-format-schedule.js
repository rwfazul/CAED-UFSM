const weekDaysKeys = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira' 
];

function createEvent(id, start, dow) {
	return {
		"id": 		 id,
		"start": 	 start,
		"rendering": "background",
		"dow": 		 [dow],
		"color": 	 "#008000" // green
	};
}

function createConstraintEvents(id, horarios) {
	var constraintEvents = [];
	weekDaysKeys.forEach(function(day, index) {
		var availableDay = horarios[day];
		if (availableDay !== undefined) { // 'horario' has weekDayKey 'day' defined
			Object.keys(availableDay).forEach(function(hour) { // for each defined hour in this day create an event
				constraintEvents.push(createEvent(id, availableDay[hour], index + 1));
			});
		}
	});
    return constraintEvents;
}