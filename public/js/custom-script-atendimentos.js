$(document).ready(function () {

  function showReponse(msg) {
    var element = $('#responseMessage');
    element.html(msg);
    setTimeout(function () {
      element.html('');
    }, 2000);
  }

  function saveData(event) {
    $.post({
      url: '/admin/atendimento/save',
      data: {
        title: event.title,
        start: event.start.format(),
        end: event.end.format()
      },
      success: function () {
        showReponse('Atendimento agendado com sucesso!');
      },
      error: function () {
        alert('Erro ao salvar atendimento');
      }
    });
  }

  function updateData(event) {
    $.post({
      url: '/admin/atendimento/update',
      data: {
        id: event.id,
        title: event.title,
        start: event.start.format(),
        end: event.end.format(),
        color: "#ec407a"
      },
      success: function () {
        showReponse('Atendimento atualizado com sucesso!');
      },
      error: function () {
        alert('Erro ao salvar atendimento');
      }
    });
  }

  $('.modal').modal();
  $('.collapsible').collapsible();
  $('.tooltipped').tooltip();
  // page is now ready, initialize the calendar...

  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },
    defaultView: 'agendaWeek',
    navLinks: true, // can click day/week names to navigate views
    editable: true,
    droppable: true, // this allows things to be dropped onto the calendar
    eventLimit: true, // allow "more" link when too many events
    weekends: false,
    allDaySlot: false,
    minTime: '08:00:00',
    maxTime: '20:00:00',
    selectable: true,
    selectHelper: true,
    /* render events from firebase */
    eventSources: [
      '/admin/atendimento',
      '/admin/servidor'
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
      saveData(event);
    },
    /* function eventDrop: Triggered when dragging stops and the event has moved to a different day/time. */
    eventDrop: function (event) {
       /*updateData funciona corretamente, só necessita recuperar o id do evento do firebase*/
      //updateData(event);
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
    /*  eventClick: function(event) {
        var decision = confirm("Do you really want to do that?"); 
        if (decision) {
          /* https://codepen.io/subodhghulaxe/pen/qEXLLr */
    /* https://fullcalendar.io/docs/eventReceive */
    /* https://stackoverflow.com/questions/6952783/fullcalender-external-event-dragg-problem */
    /*      $('#calendar').fullCalendar('removeEvents', event.id);
        }
      } */
  });

  $('#external-events .fc-event').each(function () {
    // store data so the calendar knows to render an event upon drop
    $(this).data('event', {
      title: $.trim($(this).text()), // use the element's text as the event title
      duration: "01:00",
      stick: true, // maintain when user navigates (see docs on the renderEvent method)
      color: "#3d5afe",
      constraint: $.trim($(this).text())
    });
    // make the event draggable using jQuery UI
    $(this).draggable({
      zIndex: 999,
      revert: true,      // will cause the event to go back to its
      revertDuration: 0  //  original position after the drag
    });

  });

  $('#external-events').on('mousedown', '.fc-event', function () {
    var schedule = JSON.parse($(this).attr('data-schedule'));
    schedule.forEach(function (event) {
      $('#calendar').fullCalendar('renderEvent', event);
    });
  });

  $('#external-events').on('mouseup', '.fc-event', function () {
    var id = $(this).attr('data-id');
    $('#calendar').fullCalendar('removeEvents', id);
  });

});
