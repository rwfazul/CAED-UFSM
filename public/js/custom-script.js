

	$(document).ready(function () {
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
      events: [
        {
          title: 'Isabella',
          start: '2018-09-27T14:00:00',
          end: '2018-09-27T15:00:00',
          constraint: 'fixed',
          color: '#9c27b0'
        },
        {
          id: 'fixed'
        },
        {
          title: 'Rhauani',
          start: '2018-09-25T10:00:00',
          end: '2018-09-25T11:00:00',
          color: '#4caf50'
        },
        {
          start: '2018-09-24T00:00:00',
          end: '2018-09-24T08:00:00',
          overlap: false,
          rendering: 'background',
          color: '#ff9f89'
        }
      ],
      drop: function () {
        // is the "remove after drop" checkbox checked?
        if ($('#drop-remove').is(':checked')) {
          // if so, remove the element from the "Draggable Events" list
          $(this).remove();
        }
      },
      selectable: true,
      selectHelper: true,
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
      }
		});
		
	

    //ALUNOS QUE PREENCHEM FORMULÁRIO DE SOLICITAÇÃO - SEM COR (CINZA)
    /* initialize the external events
-----------------------------------------------------------------*/
    $('#external-events .fc-event.grey').each(function () {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: '#9e9e9e'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

    //ALUNOS Resolução 33 / 2015) - COR AZUL
    $('#external-events .blue').each(function () {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: '#2196f3'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

    //ALUNOS EDUCAÇÃO ESPECIAL - COR VERDE
    $('#external-events .green').each(function () {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: '#4caf50'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

    //ALUNOS ENCAMINHADOS - COR AMARELO
    $('#external-events .amber').each(function () {
      // store data so the calendar knows to render an event upon drop
      $(this).data('event', {
        title: $.trim($(this).text()), // use the element's text as the event title
        stick: true, // maintain when user navigates (see docs on the renderEvent method)
        color: '#ffc107'
      });

      // make the event draggable using jQuery UI
      $(this).draggable({
        zIndex: 999,
        revert: true,      // will cause the event to go back to its
        revertDuration: 0  //  original position after the drag
      });

    });

  });
  
	/* Se for usado floating button
	$(".action-btn").click(function () {
	  var page = $(this).attr('id');
	  $("#content").load(page + ".html");
	})
  
	document.addEventListener('DOMContentLoaded', function () {
	  var elems = document.querySelectorAll('.fixed-action-btn');
	  var instances = M.FloatingActionButton.init(elems, {
		direction: 'left'
	  });
	});
  });
  	*/