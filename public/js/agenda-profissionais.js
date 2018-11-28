$(function () {

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();

  const $calendar = $('#calendar');
  const $external_events = $('#external-events');
  const $pagination = $('#pagination-profissionais');
  const $optionsModal = $('#optionsModal');
  const $confirmationExternalEvent = $('#confirmationExternalEvent');
  const $confirmationSchedulePeriod = $('#confirmationSchedulePeriod');  
  const $confirmationSingleEvent = $('#confirmationSingleEvent');
  const $confirmationDeletePeriod = $('#confirmationDeletePeriod');  
  const _salaId = $('#salaId').data('id');

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
  function getExternalEvents(page) {
    $.getJSON(`/api/profissionais/${page}`)
      .done(function (profissionais) {
        $external_events.empty();
        $external_events.append($('<h4>').addClass('header').text("Profissionais"));
        $("#loader-profissionais").css('display', 'none');
        $.each(profissionais, function (i, profissional) {
          $external_events.append(createExternalEvent(profissional));
        });
      })
      .fail(function () {
        alert('Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.')
      });
  }

  function createPagination(pages) {
    $pagination.materializePagination({
      align: 'left',
      lastPage: pages,
      firstPage: 1,
      useUrlParameter: false,
      onClickCallback: function (requestedPage) {
        getExternalEvents(requestedPage);
      }
    });
  }

  function getPagesExternalEvents() {
    $.getJSON(`/api/profissionais`)
      .done(function (events) {
        var pages = (events.length > 5) ? Math.ceil((events.length) / 5) : 1;
        $pagination.empty();
        createPagination(pages);
      })
      .fail(function () {
        alert(`Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.`)
      });
  }

  //function to load and reload external events and pagination
  function loadExternalEvents() {
    $("#loader-profissionais").css('display', 'block');
    getExternalEvents(1);
    getPagesExternalEvents();
  }

  loadExternalEvents();

  $($external_events).on('click', '.fc-event > .delete-external-event', function () {
    var externalEvent = $(this).parent();
    var event = $(externalEvent).data('event');
    $confirmationExternalEvent.find('.modal-info').html(`<b>Profissional:</b> ${event.title}`);
    $confirmationExternalEvent
      .data('event', {'externalEvent': externalEvent, 'title': event.title, '_externalEventId': event._externalEventId})
      .modal('open');
  });

  function removeExternalEvent(event) {
    $.ajax({
      method: 'DELETE',
      url: '/api/profissionais/' + event._externalEventId,
      success: function () {
        showResponse(`Profissional '${event.title}' <b>removido</b> com sucesso!`, 'success');
        $(event.externalEvent).remove();
        loadExternalEvents();
      },
      error: function () {
        showResponse(`Erro ao <b>remover</b> profissional '${event.title}'.`, 'error');
      }
    });
  }

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
        if (id) {
          event.id = id;
          delete event.constraint;
          $calendar.fullCalendar('updateEvent', event);
          // only updateEvent doesn't allow event resizing/change
          $calendar.fullCalendar('removeEvents', event.id); 
          $calendar.fullCalendar('renderEvent', event);
          showResponse(`Alocação de '${event.title}' <b>salva</b> com sucesso!`, 'success');
        }
      },
      error: function() {
        $calendar.fullCalendar('removeEvents', event.id); 
        showResponse(`Erro ao <b>salvar</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function saveRecurringEvent(id, data, title) {
    $.ajax({
      method: 'PUT',
      url: `/api/profissionais/agenda/${id}/semestre`,
      data: data,
      success: function(id) {
        if (id) {
          showResponse(`Alocação de '${title}' <b>salva</b> com sucesso!`, 'success');
          $calendar.fullCalendar('refetchEvents');        
        }
      },
      error: function() {
        $calendar.fullCalendar('removeEvents', event.id);
        showResponse(`Erro ao <b>salvar</b> alocação de '${title}'.`, 'error');
      }
    });
  }

  function updateEvent(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/profissionais/agenda/' + event.id,
      data: {
        start: event.start.format(),
        end: event.end.format(),
      },
      success: function () {
        showResponse(`Alocação de '${event.title}' <b>atualizada</b> com sucesso!`, 'success');
      },
      error: function () {
        showResponse(`Erro ao <b>atualizar</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function removeEvent(event) {
    $.ajax({
      method: 'DELETE',
      url: '/api/profissionais/agenda/' + event.id,
      success: function(id) {
        if (id) {
          showResponse(`Alocação de '${event.title}' <b>removida</b> com sucesso!`, 'success');
          $calendar.fullCalendar('removeEvents', event.id);
        }
      },
      error: function() {
        showResponse(`Erro ao <b>remover</b> alocação de '${event.title}'.`, 'error');
      }
    });
  }

  function scheduleEntirePeriod(event) {
    var startMonth = event.start.month();
    var endMonth = startMonth <= 6 ? 6 : 11;  //6 = july, 11 = december
    var add = endMonth - startMonth;
    var start = moment(event.start).format('YYYY/MM/DD');
    var end = moment(event.start.clone().add(add, 'month')).endOf('month').format('YYYY/MM/DD');
    var ranges = [ {start: start, end: end} ];
    var data = {
      start: moment(event.start).format('HH:mm'),
      end: moment(event.end).format('HH:mm'),
      dow: [ event.start.day() ],
      ranges: ranges
    }
    saveRecurringEvent(event.id, data, event.title);
  }

  function addExcludedDate(event) {
    var excludedDates = event.excludedDates ? event.excludedDates : [];
    excludedDates.push(moment(event.start).format('YYYY/MM/DD'));
    $.ajax({
      method: 'PUT',
      url: `/api/profissionais/agenda/${event.id}/semestre/excludedDates`,
      data: {
        excludedDates: excludedDates
      },
      success: function(id) {
        if (id) {
          showResponse(`Alocação de '${event.title}' <b>removida</b> com sucesso!`, 'success');
          $calendar.fullCalendar('refetchEvents');
        }
      },
      error: function() {
        showResponse(`Erro ao <b>remover</b> alocação de '${event.title}'.`, 'error');
      }
    })
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
    constraints.forEach(function (constraint) {
      if (constraint.dow[0] == event.end.day()) {
        var constraintStartHour = parseInt(constraint.start.substring(0, 2));
        dowHours.push(constraintStartHour);
      }
    });
    dowHours.sort(function (a, b) { return a - b }); // sort ascending
    var indexStartHour = dowHours.indexOf(event.start.hour());
    // get max startHour of all contraints (of event.end.day) in a sequential range (whitout gaps) from event.start.hour
    // this startHour add 1 is the max end hour that is allowed in resize
    var maxEndHour = getMaxContinuousHour(dowHours, indexStartHour) + 1;
    response.maxResizeHour = maxEndHour;
    // check if event.end.hour fit in the allowed range and if
    // (maxEndHour == event.end.hour) check if event.end is a full hour
    if ((maxEndHour > event.end.hour()) ||
      (maxEndHour == event.end.hour() && event.end.minute() == 0))
      return true;
    return false;
  }

  /* Modal actions */
  $optionsModal.on('click', '#btn-schedule-period', function() {7
    var event = $optionsModal.data('event');
    $confirmationSchedulePeriod.find('.modal-info').html(`<b>Profissional:</b> ${event.title}`);
    $confirmationSchedulePeriod
      .data('event', event)
      .modal('open');
  });

  $optionsModal.on('click', '#btn-delete-single', function() {
    var event = $optionsModal.data('event');
    $confirmationSingleEvent.find('.modal-info').html(`<b>Profissional:</b> ${event.title}`);
    $confirmationSingleEvent
      .data('event', event)
      .modal('open');
  });

  $optionsModal.on('click', '#btn-delete-period', function() {
    var event = $optionsModal.data('event');
    $confirmationDeletePeriod.find('.modal-info').html(`<b>Profissional:</b> ${event.title}`);
    $confirmationDeletePeriod
      .data('event', event)
      .modal('open');    
  });

  /* Modal confirmation */
  $confirmationExternalEvent.on('click', '#btn-confirmation', function() {
    removeExternalEvent($confirmationExternalEvent.data('event'));
  });

  $confirmationSchedulePeriod.on('click', '#btn-confirmation', function() {
    scheduleEntirePeriod($confirmationSchedulePeriod.data('event'));
  });

  $confirmationSingleEvent.on('click', '#btn-confirmation', function() {
    var event = $confirmationSingleEvent.data('event');
    if (!event.ranges)
      removeEvent(event);
    else 
      addExcludedDate(event);
  }); 

  $confirmationDeletePeriod.on('click', '#btn-confirmation', function() {
    removeEvent($confirmationDeletePeriod.data('event'));
  });

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
      '/api/profissionais/agenda/' + _salaId
    ],
    /* function eventRender: triggered while an event is being rendered. */
    eventRender: function(event) {
      if (event.excludedDates) { 
        for (var i = 0; i < event.excludedDates.length; i++) { // test event against all the excluded dates
          if (event.excludedDates[i] == event.start.format('YYYY/MM/DD'))
            return false;
        }
      }
      if (event.ranges) { 
        return (event.ranges.filter(function(range) { // test event against all the ranges
          return (event.start.isBetween(moment(range.start, 'YYYY/MM/DD'), moment(range.end, 'YYYY/MM/DD')));
        }).length) > 0; //if it isn't in one of the ranges, don't render it (by returning false)
      }
    },
    /* function loading: Triggered when event or resource fetching starts/stops. */
    loading: function (isLoading) {
      $("#loader-agenda").css('display', 'block');
    },
    /* function eventAfterAllRender: Triggered after all events have finished rendering. */
    eventAfterAllRender: function (view) {
      $("#loader-agenda").css('display', 'none');
    },
    /* function eventReceive: Called when a external event has been dropped onto the calendar. */
    eventReceive: function(event) {
      saveEvent(event); 
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
    eventClick: function(event) {
      if (event.id) {
        var data = {'id': event.id, 'title': event.title, 'start': event.start, 'end': event.end};
        if (event.ranges) {
          data['ranges'] = event.ranges; 
          $optionsModal.find('#div-schedule-period').hide();
          $optionsModal.find('#div-delete-period').show();        
          $optionsModal.find('#already-schedule').show();        
        } else {
          $optionsModal.find('#div-schedule-period').show();
          $optionsModal.find('#div-delete-period').hide();        
          $optionsModal.find('#already-schedule').hide();        
        }
        if (event.excludedDates)
          data['excludedDates'] = event.excludedDates;
        $optionsModal.find(".modal-title").html(`Profissional: ${event.title}`);
        $optionsModal
          .data('event', data)
          .modal('open');
      }
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