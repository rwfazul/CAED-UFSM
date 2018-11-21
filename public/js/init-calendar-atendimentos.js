function initCalendarAtendimentos($calendar, id_sala) {
    $calendar.fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay,listWeek'
        },
        defaultView: 'agendaWeek',
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        droppable: true, // this allows things to be dropped onto the calendar
        eventLimit: true, // allow "more" link when too many events,
        eventDurationEditable: false,
        eventStartEditable: false,
        weekends: false,
        allDaySlot: false,
        minTime: '08:00:00',
        maxTime: '20:00:00',
        defaultTimedEventDuration: '01:00:00',
        selectable: true,
        selectHelper: true,
        /* render events from firebase */
        eventSources: [
            '/api/profissionais/agenda/' + id_sala,
            '/api/atendimentos/agenda/' + id_sala
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
        },
        /* function eventDrop: Triggered when dragging stops and the event has moved to a different day/time. */
        eventDrop: function (event) {
            updateEvent(event);
        },
        /* function drop: Called when a valid external jQuery UI draggable has been dropped onto the calendar. */
        drop: function () {
            // remove the element from the "Draggable Events" list
            $(this).remove();
        },
        /* select method: A method for programmatically selecting a period of time. */
        select: function (start, end) {
            $modal_new_event.modal("open");
            $("#event-start").val(start);
            $("#event-end").val(end);
            $("#save-new-event").on('click', function () {
                var title = $("#event-title").val();
                var type = $("#event-type").val();
                var color = getColorNewEvent(type);
                var eventData = {
                    title: title,
                    _type: type,
                    color: color,
                    start: start,
                    stick: true,
                    end: end
                };
                saveNewEvent(eventData);
            });
            $('#calendar').fullCalendar('unselect');
        },
        /* function eventClic: Triggered when the user clicks an event. */
        eventClick: function (event) {
            if (event._type) { // if false = profissional
                var decision = confirm("Tem certeza que deseja cancelar esse atendimento?");
                if (decision)
                    removeEvent(event);
            }
        }
    });
}