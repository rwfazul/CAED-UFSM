$(function() {

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();

  var $calendar = $('#calendar');
  var $external_events = $('#external-events');
 
  // TODO: Mudar para as cores certas
  const mapColors = { 
    'Psicopedagógico':         '#4259f4',
    'Orientação Profissional': '#f4c141',
    'Psicológico':             '#ee41f4',
    'Encaminhamento':          '#f44141'
  };

  function getColor(tipoAtendimento) {
    return mapColors[tipoAtendimento];
  }

  function createExternalEvent(solicitacao) {
    var color = getColor(solicitacao.tipoAtendimento) || '#333333';
    var div = $('<div>')
      .text(solicitacao.nome)
      .addClass('fc-event')
      .draggable({     // make the event draggable using jQuery UI
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      })
      .data('event', {     // store data so the calendar knows to render an event upon drop
        title: $.trim(solicitacao.nome), // use the element's text as the event title
        duration: "01:00",
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: color, // color when event has been dropped onto the calendar
        constraint: solicitacao.id,
        // additional data
        _externalEventId: solicitacao.id,
        _constraints: createConstraintEvents(solicitacao.id, solicitacao.horarios)
      })
      .css('background-color', color);
    return div;
  }

  // fetch external events
  (function() {
    $.getJSON("/api/solicitacoes")
      .done(function(solicitacoes) {
        $.each(solicitacoes, function(i, solicitacao) {
          $external_events.append(createExternalEvent(solicitacao));
        });
      })
      .fail(function() {
        alert('Erro ao recuperar solicitações. Por favor, dentro de alguns instantes, tente recarregar a página.')
      });
  })();

  function showReponse(msg, type) {
    $.toast({
        heading: 'Sucesso',
        text: msg,
        showHideTransition: 'slide',
        icon: type
    })
    /*var element = $('#responseMessage');
    element.html(msg);
    setTimeout(function () {
      element.html('');
    }, 2000);*/
  }

  function saveEvent(event) {
    $.post({
      url: '/api/atendimentos',
      data: {
        externalEventId: event._externalEventId,
        title: event.title,
        start: event.start.format(),
        end: event.end.format(),
        color: event.color
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

  function updateData(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/atendimentos',
      data: {
        id:    event.id,
        start: event.start.format(),
        end:   event.end.format(),
      },
      success: function () {
        showReponse(`Atendimento de '${event.title}' atualizado com sucesso!`, 'success');
      },
      error: function () {
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
    eventStartEditable: true,
    weekends: false,
    allDaySlot: false,
    minTime: '08:00:00',
    maxTime: '20:00:00',
    defaultTimedEventDuration: '01:00:00',
    selectable: true,
    selectHelper: true,
    /* render events from firebase */
    eventSources: [
      '/api/atendimentos',
      //'/admin/servidor'
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
      updateData(event);
    },
    /* function drop: Called when a valid external jQuery UI draggable has been dropped onto the calendar. */
    drop: function () {
      // remove the element from the "Draggable Events" list
      $(this).remove();
    },
    /* function eventResize: Triggered when resizing stops and the event has changed in duration. */
    eventResize: function (event) {
      alert(event.title + " end is now " + event.end.format());
      /*updateData funciona corretamente, só necessita recuperar o id do evento do firebase*/
      //updateData(event);
    },
    /* select method: A method for programmatically selecting a period of time. */
    select: function (start, end) {
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
        var decision = confirm("Tem certeza que deseja cancelar esse agendamento?"); 
        if (decision) {
          /* https://codepen.io/subodhghulaxe/pen/qEXLLr */
    /* https://fullcalendar.io/docs/eventReceive */
    /* https://stackoverflow.com/questions/6952783/fullcalender-external-event-dragg-problem */
          $('#calendar').fullCalendar('removeEvents', event.id);
        }
    },
    // Triggered when event dragging begins.
    eventDragStart: function( event, jsEvent, ui, view ) { 
      // active contraints    
    }
    /*eventDragStop: function(event, jsEvent, ui, view) {             
      if(isEventOverDiv(jsEvent.clientX, jsEvent.clientY)) {
        $calendar.fullCalendar('removeEvents', event._id);
        createEvent(event).appendTo($external_events);
      }
    }*/
  });

 /*var isEventOverDiv = function(x, y) {
    var offset = $external_events.offset();
    offset.right = $external_events.width() + offset.left;
    offset.bottom = $external_events.height() + offset.top;
    // Compare
    if (x >= offset.left
        && y >= offset.top
        && x <= offset.right
        && y <= offset .bottom) { return true; }
    return false;
  }*/

  // render contraints events (defined in _constraints) of triggered external event
  $('#external-events').on('mousedown', '.fc-event', function () {
    $calendar.fullCalendar('renderEvents', $(this).data('event')._constraints);
  });
  
  // remove contraints events (with id defined in _externalEventId) of triggered external event
  $('#external-events').on('mouseup', '.fc-event', function () {
    $calendar.fullCalendar('removeEvents', $(this).data('event')._externalEventId);
  });

});