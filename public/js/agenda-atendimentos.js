$(function () {

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();

  const $calendar = $('#calendar');
  const $external_events = $('.external-events');
  const $pagination = $('.pagination');

  const _salaId = $('#salaId').data('id');

  // TODO: Mudar para as cores certas
  const mapColors = {
    //tipo de atendimento
    'Psicológico': '#2196f3', // azul fraco 
    'Psicopedagógico': '#f57f17', //laranja
    'Orientação Profissional': '#9e9e9e', //cinza 
  };

  const mapHeaders = {
    'success': 'Sucesso',
    'error': 'Erro',
    'warning': 'Atenção',
    'information': 'Alerta'
  }

  function getColor(tipoAtendimento) {
    return mapColors[$.trim(tipoAtendimento)];
  }

  function createExternalEvent(event, type) {
    var color = getColor(event.tipoAtendimento);
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
        _type: type,
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
      plural: 'solicitações',
      external: $('#external-events-solicitacoes'),
      pagination: $('#pagination-solicitacoes'),
      pages: 1
    },
    encaminhamentos: {
      collection: 'encaminhamentos',
      sing: 'encaminhamento',
      plural: 'encaminhamentos',
      external: $('#external-events-encaminhamentos'),
      pagination: $('#pagination-encaminhamentos'),
      pages: 1
    }
  }

  // fetch external events
  function getExternalEvents(type, page) {
    $.getJSON(`/api/${type.collection}/pagination/${page}`)
      .done(function (events) {
        $container = type.external;
        $container.empty();
        $container.append($('<h4>').addClass('header').text(type.plural));
        $.each(events, function (i, event) {
          $container.append(createExternalEvent(event, type.collection));
        });
      })
      .fail(function () {
        alert(`Erro ao recuperar ${type.plural}. Por favor, dentro de alguns instantes, tente recarregar a página.`)
      });
  }

  function createPagination(type) {
    $container = type.pagination;
    $container.append("<li id='left' class='get-events-page waves-effect'><a href='#!'><i class='material-icons'>chevron_left</i></a></li>");
    for (var i = 1; i <= type.pages; i++) {
      var li = $('<li>').attr("id", i).addClass("get-events-page").addClass("waves-effect");
      var a = $('<a>').attr("href", "#!").text(i);
      li.append(a);
      if (i == 1)
        li.addClass("active");
      $container.append(li);
    }
    $container.append("<li id='right' class='get-events-page waves-effect'><a href='#!'><i class='material-icons'>chevron_right</i></a></li>");
  }

  function getPagesExternalEvents(type) {
    $.getJSON(`/api/${type.collection}/externalEvents`)
      .done(function (events) {
        type.pages = (events.length > 5) ? Math.ceil((events.length) / 5) : 1;
        type.pagination.empty();
        createPagination(type);
      })
      .fail(function () {
        alert(`Erro ao recuperar ${type.plural}. Por favor, dentro de alguns instantes, tente recarregar a página.`)
      });
  }

  loadExternalEvents(types.solicitacoes);
  loadExternalEvents(types.encaminhamentos);

  //function to load and reload external events and pagination
  function loadExternalEvents(type){
    getPagesExternalEvents(type);
    getExternalEvents(type, 1);
  }

  $($external_events).on('click', '.fc-event > .delete-external-event',
    function () {
      removeExternalEvent($(this).parent())
    });

  //get events from page
  $pagination.on('click', '.get-events-page',
    function () {
      var page;
      var id = $(this).attr("id");
      var parent = $(this).parent();
      var anterior = parent.find('.active');
      var type = parent.attr("id") == "pagination-solicitacoes" ? types.solicitacoes : types.encaminhamentos;
      switch(id){
        case "left":
          page = anterior.attr("id") > 1 ? parseInt(anterior.attr("id")) - 1 : 1;
          break;
        case "right":
          page = anterior.attr("id") < type.pages ? parseInt(anterior.attr("id")) + 1 : type.pages;
          break;
        default:
          page = id;
          break;
      }
      anterior.removeClass('active');
      parent.find('#' + page + "").addClass("active");
      getExternalEvents(type, page);
    });

  function removeExternalEvent(externalEvent) {
    var event = $(externalEvent).data('event');
    var type = types[$(externalEvent).data('type')];
    $.ajax({
      method: 'DELETE',
      url: `/api/${type.collection}/${event._externalEventId}`,
      success: function () {
        var singCap = type.sing.charAt(0).toUpperCase() + type.sing.slice(1);
        showReponse(`${singCap} '${event.title}' <b>removido</b> com sucesso!`, 'success');
        $(externalEvent).remove();
        loadExternalEvents(type);
      },
      error: function () {
        showReponse(`Erro ao <b>remover</b> ${type.sing} '${event.title}'.`, 'error');
      }
    });
  }

  function removeEvent(event) {
    $.ajax({
      method: 'DELETE',
      url: '/api/atendimentos/agenda/' + event.id,
      success: function (id) {
        if (id) {
          updateSolicitacao(event, false);
          showReponse(`Atendimento de '${event.title}' <b>removido</b> com sucesso!`, 'success');
          $('#calendar').fullCalendar('removeEvents', event.id);
          loadExternalEvents(types[event._type]);
        }
      },
      error: function () {
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
        salaId: _salaId,
        type: event._type
      },
      success: function (id) {
        event.id = id;
        $calendar.fullCalendar('updateEvent', event);
        updateSolicitacao(event, true);
        loadExternalEvents(types[event._type]);
        showReponse(`Atendimento de '${event.title}' agendado com sucesso!`, 'success');
      },
      error: function () {
        showReponse(`Erro ao salvar atendimento de '${event.title}'.`, 'error');
      }
    });
  }

  function updateSolicitacao(event, ja_agendado) {
    $.ajax({
      method: 'PUT',
      url: '/api/'+ event._type + '/' + event._externalEventId,
      data: {
        agendado: ja_agendado
      },
      success: function () {
      },
      error: function () {
      }
    });
  }

  function updateEvent(event) {
    $.ajax({
      method: 'PUT',
      url: '/api/atendimentos/agenda' + event.id,
      data: {
        start: event.start.format(),
        end: event.end.format(),
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
    eventClick: function (event) {
      var decision = confirm("Tem certeza que deseja cancelar esse atendimento?");
      if (decision)
        removeEvent(event);
    }
  });

  // render contraints events (defined in _constraints) of triggered external event
  $external_events.on('mousedown', '.fc-event', function () {
    $calendar.fullCalendar('renderEvents', $(this).data('event')._constraints);
  });

  // remove contraints events (with id defined in _externalEventId) of triggered external event
  $external_events.on('mouseup', '.fc-event', function () {
    $calendar.fullCalendar('removeEvents', $(this).data('event')._externalEventId);
  });

});