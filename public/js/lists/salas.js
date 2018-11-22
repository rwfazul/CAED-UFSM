$(function () {
  var $table = $('#table-salas');
  var $tbody = $table.find('tbody');
  var $container = $('#salas');

  $.getJSON("/api/salas")
    .done(function (salas) {
      $.each(salas, function (i, sala) {
        $tbody.append(
          `<tr>
              <td>${sala.nome}</td>
              <td>
                <a class="modal-trigger btn btn-horarios" href="#${sala.id}">Clique aqui <i class="left material-icons">search</i></a>
              </td>
           </tr>`
        );
        $container.append(
          "<div class='modal' id='" + sala.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + sala.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
          $(`#${sala.id} > .modal-content`)
            .append(createScheduleTable(sala.horarios));
      });
      $('.modal').modal(); 
      initDataTable($table, 'sala', 'salas'); // file init-datatable.js
      $("#loader-events").css('display', 'none');
    })
    .fail(function() {
      alert('Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });

});