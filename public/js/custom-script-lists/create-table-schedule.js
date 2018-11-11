const weekDaysKeys = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira'
  ];

  const timesKeys = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
  ];

  function getAvailableHours(horarios) {
    var availableDays = [];
    weekDaysKeys.forEach(function (day, index) {
      var arrayHoursBoolean = [false, false, false, false, false, false, false, false, false, false];
      var arrayHours = horarios[day];
      if (arrayHours !== undefined) { // 'horario' has weekDayKey 'day' defined
        Object.keys(timesKeys).forEach(function (hour, i) {
          Object.keys(arrayHours).forEach(function (hourAvailable) { // for each defined hour in this day create an event
            if (arrayHours[hourAvailable].includes(timesKeys[hour]))
              arrayHoursBoolean[i] = true;
          });
        });
      }
      availableDays.push(arrayHoursBoolean);
    });
    return availableDays;
  }

  function tableAvailableHours(horarios) {
    var availableHours = getAvailableHours(horarios);
    var table = $('<table>');
    table.addClass('layout display responsive-table bordered');
    var thead = $('<thead>');
    var rowHead = $('<tr>');
    var colH = $('<th>').text("Dias");
    rowHead.append(colH);
    timesKeys.forEach(function (time) {
      var colHead = $('<th>').text(time);
      rowHead.append(colHead);
    });
    thead.append(rowHead);
    table.append(thead);

    var tbody = $('<tbody>');
    Object.keys(availableHours).forEach(function (day) {
      var row = $('<tr>');
      var colD = $('<td>').text(weekDaysKeys[day]);
      row.append(colD);
      var arrayBoolean = availableHours[day];
      arrayBoolean.forEach(function (node) {
        var col = $('<td>').addClass("center lighten-3 white-text");
        var icon = $('<i>').addClass("small material-icons");
        if(node){
          icon.text("check_circle");
          col.addClass("green");
        }
        else {
          icon.text("cancel");
          col.addClass("red");
        }
        col.append(icon); 
        row.append(col);
      });
      tbody.append(row);
    });
    table.append(tbody);
    return table;
  }