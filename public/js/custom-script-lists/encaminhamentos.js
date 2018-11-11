$(function () {
  var $table = $('#table-encaminhamentos');
  var $modal = $('#encaminhamentos');

  $.getJSON("/api/solicitacoes") // a rota que ta em encaminhamentos vai ter que fazer query pelo encaminhamento:true
    .done(function (encaminhamentos) {
      $.each(encaminhamentos, function (i, encaminhamento) {
        $table.append(
          "<tr>"
          + "<td>" + encaminhamento.nome + "</td>"
          + "<td>" + encaminhamento.email + "</td>"
          + "<td>" + encaminhamento.curso + "</td>"
          + "<td>" + encaminhamento.matricula + "</td>"
          + "<td>" + encaminhamento.telefone + "</td>"
          + "<td>" + encaminhamento.motivoProcura + "</td>"
          + "<td>" + encaminhamento.tipoAtendimento + "</td>"
          + "<td><a class='modal-trigger waves-effect waves-green btn-flat' href='#" + encaminhamento.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"
          + "</tr>"
        );
        $modal.append(
          "<div class='modal' id='" + encaminhamento.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + encaminhamento.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");
          $('#' + encaminhamento.id + '> .modal-content').append(tableAvailableHours(encaminhamento.horarios)).modal();
      });
      $('.modal').modal(); 
      $('#loader-circle').fadeOut('fast', function () {
        $(this).remove();
      });
      initDataTable($table, 'encaminhamento', 'encaminhamentos'); // file initDataTable.js
    })  
    .fail(function() {
      alert('Erro ao recuperar encaminhamentos. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });
});