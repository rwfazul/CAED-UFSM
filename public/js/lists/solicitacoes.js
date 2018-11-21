$(function () {
  var $table = $('#table-solicitacoes');
  var $tbody = $table.find('tbody');
  var $container = $('#solicitacoes');
  $.getJSON("/api/solicitacoes") 
    .done(function (solicitacoes) {
      $.each(solicitacoes, function (i, solicitacao) {
        $tbody.append(
          "<tr>"
          + "<td>" + moment(solicitacao.timestamp, "YYYY-MM-DD").format("DD/MM/YYYY") + "</td>"
          + "<td>" + solicitacao.matricula + "</td>"
          + "<td>" + solicitacao.nome + "</td>"
          + "<td>" + solicitacao.email + "</td>"
          + "<td>" + solicitacao.tipoAtendimento + "</td>"
          + "<td>" + solicitacao.curso + "</td>"
          + "<td>" + solicitacao.telefone + "</td>"
          + "<td>" + solicitacao.temDeficiencia + "</td>"
          + "<td>" + solicitacao.ehIntercambista + "</td>"
          + "<td>" + solicitacao.motivoProcura + "</td>"
          + "<td>" + solicitacao.jaAtendido + "</td>"
          + "<td>" + solicitacao.motivoEncerramento + "</td>" 
          + "<td><a class='modal-trigger btn btn-horarios' href='#" + solicitacao.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"         
          + "</tr>"
        );
        $container.append(
          "<div class='modal' id='" + solicitacao.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + solicitacao.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
          $(`#${solicitacao.id} > .modal-content`)
            .append(createScheduleTable(solicitacao.horarios));
      });
      $('.modal').modal(); 
      $('#loader-circle').fadeOut('fast', function () {
        $(this).remove();
      });
      initDataTable($table, 'solicitação', 'solicitações'); // file init-datatable.js
    })
    .fail(function() {
      alert('Erro ao recuperar solicitações. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });
});