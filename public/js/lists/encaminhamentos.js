$(function () {
  var $table = $('#table-encaminhamentos');
  var $tbody = $table.find('tbody');
  var $container = $('#encaminhamentos');
// document.createElement
  $.getJSON("/api/encaminhamentos") // a rota que ta em encaminhamentos vai ter que fazer query pelo encaminhamento:true
    .done(function (encaminhamentos) {
      $.each(encaminhamentos, function (i, encaminhamento) {
        $tbody.append(
          "<tr>"
          + "<td>" + moment(encaminhamento.timestamp, "YYYY-MM-DD").format("DD/MM/YYYY") + "</td>"
          + "<td>" + encaminhamento.matricula + "</td>"
          + "<td>" + encaminhamento.nome + "</td>"
          + "<td>" + encaminhamento.email + "</td>"
          + "<td>" + encaminhamento.tipoAtendimento + "</td>"
          + "<td>" + encaminhamento.curso + "</td>"
          + "<td>" + encaminhamento.telefone + "</td>"
          + "<td>" + encaminhamento.temDeficiencia + "</td>"
          + "<td>" + encaminhamento.ehIntercambista + "</td>"
          + "<td>" + encaminhamento.servidor_nome + "</td>"
          + "<td>" + encaminhamento.siape + "</td>"
          + "<td>" + encaminhamento.servidor_email + "</td>"
          + "<td>" + encaminhamento.motivoEncaminhamento + "</td>"
          + "<td><a class='modal-trigger btn btn-horarios' href='#" + encaminhamento.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"
          + "</tr>"
        );
        $container.append(
          "<div class='modal' id='" + encaminhamento.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + encaminhamento.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
          $(`#${encaminhamento.id} > .modal-content`)
            .append(createScheduleTable(encaminhamento.horarios));
      });
      $('.modal').modal(); 
      $('#loader-circle').fadeOut('fast', function () {
        $(this).remove();
      });
      initDataTable($table, 'encaminhamento', 'encaminhamentos'); // file init-datatable.js
    })
    .fail(function() {
      alert('Erro ao recuperar encaminhamentos. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });
});