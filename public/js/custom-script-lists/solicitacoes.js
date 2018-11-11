$(function () {
  var $table = $('#table-solicitacoes');
  var $modal = $('#solicitacoes');

  $.getJSON("/api/solicitacoes") // a rota que ta em solicitacoes vai ter que fazer query pelo encaminhamento:false
    .done(function (solicitacoes) {
      $.each(solicitacoes, function (i, solicitacao) {
        $table.append(
          "<tr>"
          + "<td>" + solicitacao.nome + "</td>"
          + "<td>" + solicitacao.email + "</td>"
          + "<td>" + solicitacao.curso + "</td>"
          + "<td>" + solicitacao.matricula + "</td>"
          + "<td>" + solicitacao.telefone + "</td>"
          + "<td>" + solicitacao.motivoProcura + "</td>"
          + "<td>" + solicitacao.tipoAtendimento + "</td>"
          + "<td><a class='modal-trigger waves-effect waves-green btn-flat' href='#" + solicitacao.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"
          + "</tr>"
        );
        $modal.append(
          "<div class='modal' id='" + solicitacao.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + solicitacao.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
        $('#' + solicitacao.id + '> .modal-content').append(tableAvailableHours(solicitacao.horarios)).modal();
      });
      $('.modal').modal(); 
      $('#loader-circle').fadeOut('fast', function () {
        $(this).remove();
      });
      initDataTable($table, 'sala', 'salas'); // file initDataTable.js
    })
    .fail(function() {
      alert('Erro ao recuperar solicitações. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });
});