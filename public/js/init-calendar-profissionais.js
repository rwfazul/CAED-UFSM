function initCalendarProfissionais($calendar, id_sala) {
  $calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },
    defaultView: 'agendaWeek',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventOverlap: true, // don't allow sobreposition
    droppable: true, // this allows things to be dropped onto the calendar
    eventLimit: true, // allow "more" link when too many events,
    eventDurationEditable: false,
    eventStartEditable: false,
    weekends: false,
    allDaySlot: false,
    minTime: '08:00:00',
    maxTime: '20:00:00',
    defaultTimedEventDuration: '01:00:00',
    selectable: false,
    selectHelper: true,
    /* render events from firebase */
    eventSources: [
      '/api/profissionais/agenda/' + id_sala
    ],
    /* function loading: Triggered when event or resource fetching starts/stops. */
    loading: function (isLoading) {
      $("#loader-events").css('display', 'block');
    },
    /* function eventAfterAllRender: Triggered after all events have finished rendering. */
    eventAfterAllRender: function (view) {
      $("#loader-events").css('display', 'none');
    },
    /* function eventReceive: Called when a external event has been dropped onto the calendar. */
    eventReceive: function (event) {
      saveEvent(event);
      var decision = confirm("Agendar até o fim do semestre?");
      if (decision) {
        agendarSemestreInteiro(event);
      }
    },
    /* function eventResize: Triggered when resizing stops and the event has changed in duration. */
    eventResize: function (event, delta, revertFunc) {
      var response = { maxResizeHour: '' };
      if (event.end.minute() != 0) {
        showResponse(`Alocação deve ser feita em horas cheias (${event.end.hour()}:${event.end.minute()} não é permitido).`, 'warning');
        revertFunc();
        return;
      }
      if (isValidResize(event, response))
        updateEvent(event);
      else {
        showResponse(`O profissional '${event.title} só tem disponibilidade até as ${response.maxResizeHour} horas.`, 'warning');
        revertFunc();
      }
    },
    /* function eventClick: Triggered when the user clicks an event. */
    eventClick: function (event) {
      var decision = confirm("Tem certeza que deseja cancelar essa locação?");
      if (decision)
        removeEvent(event);
    }
  });
}