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

function createTableHeader() {
  var thead = $('<thead>');
  var rowHead = $('<tr><th>Dias</th></tr>');
  rowHead.append( timesKeys.map(time => $('<th>').text(time)) );
  thead.append(rowHead);
  return thead;
}

function createTableDataCell(available, colspan) {
  var col = $('<td class="center lighten-3 white-text">');
  var icon = $('<i class="small material-icons">');
  icon.text(available ? "check_circle" : "cancel");
  col.addClass(available ? "green" : "red");
  col.append(icon);
  if (colspan) col.attr('colspan', colspan);
  return col;
}

function createTableBody(horarios) {
  var tbody = $('<tbody>');
  weekDaysKeys.forEach(function(day) {
    var row = $('<tr>');
    row.append($(`<td>${day}</d>`));
    if (horarios[day]) {
      timesKeys.forEach(function(hour) {
        var availableHours = Object.values(horarios[day]);
        row.append(createTableDataCell( $.inArray(hour, availableHours) > -1 ));
      });
    } else
      row.append(createTableDataCell(false, timesKeys.length));
    tbody.append(row);
  });
  return tbody;
}

function createScheduleTable(horarios) {
  var table = $('<table class="layout display responsive-table bordered">');
  table.append(createTableHeader());
  table.append(createTableBody(horarios));
  return table;
}