$(function() {

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();

  const $calendar = $('#calendar');
  const $external_events = $('#external-events');
  const _salaId = $('#salaId').data('id');

  // TODO: Mudar para as cores certas
  const mapColors = { 
    //especialidade profissional
    'Psicologia': '#f44336', //vermelho forte
    'Psicopedagogia': '#9c27b0', //roxo forte
    'Pedagogia': '#009688', //azul esverdeado
    'Educação Especial': '#ffc107' //amarelo 
  };

  const mapHeaders = {
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Atenção',
    'information': 'Alerta'
  }

  function getColor(especialidade) {
    return mapColors[especialidade];
  }

  function createExternalEvent(profissional) {
    var color = getColor(profissional.especialidade);
    var div = $('<div>')
      .text(profissional.nome)
      .addClass('fc-event')
      .draggable({     // make the event draggable using jQuery UI
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      })
      .data('event', {     // store data so the calendar knows to render an event upon drop
        title: $.trim(profissional.nome), // use the element's text as the event title
        duration: "01:00",
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: color, // color when event has been dropped onto the calendar
        constraint: profissional.id,
        durationEditable: true,
        // additional data
        _externalEventId: profissional.id,
        _constraints: createConstraintEvents(profissional.id, profissional.horarios)
      })
      .css('background-color', color)
      .append(
        `<span class="delete-external-event right"'>
          <i class="material-icons">delete_forever</i>
         </span>`
      );
    return div;
  }

  // fetch external events
  (function() {
    $.getJSON("/api/profissionais")
      .done(function(profissionais) {
        $.each(profissionais, function(i, profissional) {
          $external_events.append(createExternalEvent(profissional));
        });
      })
      .fail(function() {
        alert('Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.')
      });
  })();

  $($external_events).on('click', '.fc-event > .delete-external-event', function() {
    var externalEvent = $(this).parent();
    var event = $(externalEvent).data('event');
    $.ajax({
      method: 'DELETE',
      url: '/api/profissionais/' + event._externalEventId,
      success: function() {
        showResponse(`Profissional '${event.title}' <b>removido</b> com sucesso!`, 'success');
        $(externalEvent).remove();
      },
      error: function() {
        showResponse(`Erro ao <b>remover</b> profissional '${event.title}'.`, 'error');
      }
    });
  });

  function showResponse(msg, type) {
    $.toast({
      heading: mapHeaders[type],
      text: msg,
      showHideTransition: 'slide',
      icon: type
    });
  }

  function saveEvent(event) {
    $.post({
      url: '/api/profissionais/agenda',
      data: {
        title: event.title,
        start: event.start.format(),
        end: event.end.format(),
        color: event.color,
        salaId: _salaId
      },
      success: function(id) {
        event.id = id;
        delete event.constraint;
        $calendar.fullCalendar('updateEvent', event);
        // only updateEvent doesn't allow event resizing/change
        $calendar.fullCalendar('removeEvents', event.id); 
        $calendar.fullCalendar('renderEvent', event);
        showResponse(`Alocação de '${event.title}' <b>salva</b> com sucesso!`, 'success');
      },
      error: function() {
        $calendar.fullCalendar('removeEvents', event.id); 
        showResponse(`Erro ao <b>salvar</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function updateEvent(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/profissionais/agenda/' + event.id,
      data: {
        start: event.start.format(),
        end:   event.end.format(),
      },
      success: function() {
        showResponse(`Alocação de '${event.title}' <b>atualizada</b> com sucesso!`, 'success');
      },
      error: function() {
        showResponse(`Erro ao <b>atualizar</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function removeEvent(event) {
    $.ajax({
      method: 'DELETE',
      url: '/api/profissionais/agenda/' + event.id,
      success: function() {
        showResponse(`Alocação de '${event.title}' <b>removida</b> com sucesso!`, 'success');
        $('#calendar').fullCalendar('removeEvents', event.id);
      },
      error: function() {
        showResponse(`Erro ao <b>remover</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function getMaxContinuousHour(array, start) {
    var max = array[start];
    for (var i = start + 1; i < array.length; i++) {
      if ((max + 1) !== array[i])
        return max;
      max = array[i];
    }
    return max;
  }

  function isValidResize(event, response) {
    var constraints = event._constraints;
    var dowHours = [];
    // find all constraints' start hours in the day of this event
    constraints.forEach(function(constraint) {
      if (constraint.dow[0] == event.end.day()) {
        var constraintStartHour = parseInt(constraint.start.substring(0, 2));
        dowHours.push(constraintStartHour);
      }
    });
    dowHours.sort(function(a, b){ return a - b }); // sort ascending
    var indexStartHour = dowHours.indexOf(event.start.hour());
    // get max startHour of all contraints (of event.end.day) in a sequential range (whitout gaps) from event.start.hour
    // this startHour add 1 is the max end hour that is allowed in resize
    var maxEndHour = getMaxContinuousHour(dowHours, indexStartHour) + 1;
    response.maxResizeHour = maxEndHour;
    // check if event.end.hour fit in the allowed range and if
    // (maxEndHour == event.end.hour) check if event.end is a full hour
    if ( (maxEndHour > event.end.hour()) ||
         (maxEndHour == event.end.hour() && event.end.minute() == 0) )
        return true;
    return false;
  }

  // page is now ready, initialize the calendar...
  $calendar.fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },
    defaultView: 'agendaWeek',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    eventOverlap: false, // don't allow sobreposition
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
      '/api/profissionais/agenda/' + _salaId
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
    /* function eventResize: Triggered when resizing stops and the event has changed in duration. */
    eventResize: function(event, delta, revertFunc) {
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
    eventClick: function(event) {
        var decision = confirm("Tem certeza que deseja cancelar essa locação?"); 
        if (decision)
          removeEvent(event);
    }
  });

  // render contraints events (defined in _constraints) of triggered external event
  $('#external-events').on('mousedown', '.fc-event', function () {
    $calendar.fullCalendar('renderEvents', $(this).data('event')._constraints);
  });
  
  // remove contraints events (with id defined in _externalEventId) of triggered external event
  $('#external-events').on('mouseup', '.fc-event', function () {
    $calendar.fullCalendar('removeEvents', $(this).data('event')._externalEventId);
  });

});