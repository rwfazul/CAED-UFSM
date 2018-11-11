$(function () {
  var $table = $('#table-profissionais');
  var $container = $('#profissionais');

  $.getJSON("/api/profissionais")
    .done(function (profissionais) {
      $.each(profissionais, function (i, profissional) {
        $table.append(
          "<tr>"
          + "<td>" + profissional.nome + "</td>"
          + "<td>" + profissional.especialidade + "</td>"
          + "<td><a class='modal-trigger waves-effect waves-green btn-flat' href='#" + profissional.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"
          + "</tr>"
        );
        $container.append(
          "<div class='modal' id='" + profissional.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + profissional.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
          $(`#${profissional.id} > .modal-content`)
            .append(createScheduleTable(profissional.horarios));      
      });
      $('.modal').modal(); 
      $('#loader-circle').fadeOut('fast', function () {
        $(this).remove();
      });
      initDataTable($table, 'profissional', 'profissionais'); // file initDataTable.js
    })
    .fail(function() {
      alert('Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });
});