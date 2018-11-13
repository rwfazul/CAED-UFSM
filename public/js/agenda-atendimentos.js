$(function() {

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();

  const $calendar = $('#calendar');
  const $external_events = $('.external-events');
  const $external_solicitacoes = $('#external-events-solicitacoes');
  const $external_encaminhamentos = $('#external-events-encaminhamentos');

  const _salaId = $('#salaId').data('id');

  // TODO: Mudar para as cores certas
  const mapColors = { 
    'Psicopedagógico':         '#4259f4',
    'Orientação Profissional': '#f4c141',
    'Psicológico':             '#ee41f4',
    'Encaminhamento':          '#f44141'
  };

  const mapHeaders = {
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Atenção',
    'information': 'Alerta'
  }

  function getColor(tipoAtendimento) {
    return mapColors[tipoAtendimento];
  }

  function createExternalEvent(event, type) {
    var color = getColor(event.tipoAtendimento) || '#333333';
    var div = $('<div>')
      .text($.trim(event.nome))
      .addClass('fc-event')
      .draggable({     // make the event draggable using jQuery UI
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      })
      .data('event', {     // store data so the calendar knows to render an event upon drop
        title: $.trim(event.nome), // use the element's text as the event title
        duration: "01:00",
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: color, // color when event has been dropped onto the calendar
        constraint: event.id,
        // additional data
        _externalEventId: event.id,
        _constraints: createConstraintEvents(event.id, event.horarios)
      })
      .data('type', type)
      .css('background-color', color)
      .append(
        `<span class="delete-external-event right">
          <i class="material-icons">delete_forever</i>
         </span>`
      );
    return div;
  }

  const types = {
    solicitacoes: {
      collection: 'solicitacoes',
      sing: 'solicitação',
      plural: 'solicitações'
    },
    encaminhamentos: {
      collection: 'encaminhamentos',
      sing: 'encaminhamento',
      plural: 'encaminhamentos'
    }
  }

  // fetch external events
  function getExternalEvents($container, type) {
    $.getJSON(`/api/${type.collection}`)
      .done(function(events) {
        $.each(events, function(i, event) {
          $container.append(createExternalEvent(event, type.collection));
        });
      })
      .fail(function() {
        alert(`Erro ao recuperar ${type.plural}. Por favor, dentro de alguns instantes, tente recarregar a página.`)
      }); 
  }

  getExternalEvents($external_solicitacoes, types.solicitacoes);
  getExternalEvents($external_encaminhamentos, types.encaminhamentos);

  $($external_events).on('click', '.fc-event > .delete-external-event', 
    function() {
      removeExternalEvent($(this).parent())

    });

  function removeExternalEvent(externalEvent) {
    var event = $(externalEvent).data('event');
    var type = types[$(externalEvent).data('type')];
    $.ajax({
      method: 'DELETE',
      url: `/api/${type.collection}/${event._externalEventId}`,
      success: function() {
        var singCap = type.sing.charAt(0).toUpperCase() + type.sing.slice(1);
        showReponse(`${singCap} '${event.title}' <b>removido</b> com sucesso!`, 'success');
        $(externalEvent).remove();
      },
      error: function() {
        showReponse(`Erro ao <b>remover</b> ${type.sing} '${event.title}'.`, 'error');
      }
    });
  }

  function removeEvent(event) {
    $.ajax({
      method: 'DELETE',
      url: '/api/atendimentos/agenda/' + event.id,
      success: function(id) {
        if (id) {
          showReponse(`Atendimento de '${event.title}' <b>removida</b> com sucesso!`, 'success');
          $('#calendar').fullCalendar('removeEvents', event.id);
        }
      },
      error: function() {
        showReponse(`Erro ao <b>remover</b> atendimento de '${event.title}'.`, 'error');
      }
    });
  }

  function showReponse(msg, type) {
    $.toast({
      heading: mapHeaders[type],
      text: msg,
      showHideTransition: 'slide',
      icon: type
    });
  }

  function saveEvent(event) {
    $.post({
      url: '/api/atendimentos/agenda',
      data: {
        title: event.title,
        start: event.start.format(),
        end: event.end.format(),
        color: event.color,
        externalEventId: event._externalEventId,
        salaId: _salaId
      },
      success: function(id) {
        event.id = id;
        $calendar.fullCalendar('updateEvent', event);
        showReponse(`Atendimento de '${event.title}' agendado com sucesso!`, 'success');
      },
      error: function() {
        showReponse(`Erro ao salvar atendimento de '${event.title}'.`, 'error');
        // alert(`Erro ao salvar atendimento de '${event.title}'`);
      }
    });
  }

  function updateEvent(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/atendimentos/agenda' + event.id,
      data: {
        start: event.start.format(),
        end:   event.end.format(),
      },
      success: function() {
          showReponse(`Atendimento de '${event.title}' atualizado com sucesso!`, 'success');
      },
      error: function() {
        showReponse(`Erro ao atualizar atendimento de '${event.title}'.`, 'error');
        // alert(`Erro ao salvar atendimento de '${event.title}'`);
      }
    });
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
      '/api/profissionais/agenda/' + _salaId,
      '/api/atendimentos/agenda/' + _salaId
    ],
    /* function loading: Triggered when event or resource fetching starts/stops. */
    loading: function(isLoading) {
      $("#loader-events").css('display', 'block');
    },
    /* function eventAfterAllRender: Triggered after all events have finished rendering. */
    eventAfterAllRender: function(view) {
      $("#loader-events").css('display', 'none');
    },
    /* function eventReceive: Called when a external event has been dropped onto the calendar. */
    eventReceive: function(event) {
      saveEvent(event);
    },
    /* function eventDrop: Triggered when dragging stops and the event has moved to a different day/time. */
    eventDrop: function(event) {
      updateEvent(event);
    },
    /* function drop: Called when a valid external jQuery UI draggable has been dropped onto the calendar. */
    drop: function() {
      // remove the element from the "Draggable Events" list
      $(this).remove();
    },
    /* function eventResize: Triggered when resizing stops and the event has changed in duration. */
    eventResize: function(event) {
      alert(event.title + " end is now " + event.end.format());
      /*updateData funciona corretamente, só necessita recuperar o id do evento do firebase*/
      //updateData(event);
    },
    /* select method: A method for programmatically selecting a period of time. */
    select: function(start, end) {
      var title = prompt('Event Title:');
      var eventData;
      if (title) {
        eventData = {
          title: title,
          start: start,
          end: end
        };
        $('#calendar').fullCalendar('renderEvent', eventData, true); // stick? = true
      }
      $('#calendar').fullCalendar('unselect');
    },
    /* function eventClic: Triggered when the user clicks an event. */
    eventClick: function(event) {
        var decision = confirm("Tem certeza que deseja cancelar esse atendimento?"); 
        if (decision)
          removeEvent(event);
    }
  });

  // render contraints events (defined in _constraints) of triggered external event
  $external_events.on('mousedown', '.fc-event', function() {
    $calendar.fullCalendar('renderEvents', $(this).data('event')._constraints);
  });
  
  // remove contraints events (with id defined in _externalEventId) of triggered external event
  $external_events.on('mouseup', '.fc-event', function() {
    $calendar.fullCalendar('removeEvents', $(this).data('event')._externalEventId);
  });

});