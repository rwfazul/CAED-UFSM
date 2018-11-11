$(function () {
  var $table = $('#table-solicitacoes');
  var $modal = $('#solicitacoes');

  $.getJSON("/api/solicitacoes")
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


        $('.modal').modal(); 
        initDataTable();
        $('#' + solicitacao.id + '> .modal-content').append(tableAvailableHours(solicitacao.horarios));
        $('#loader-circle').fadeOut('fast', function () {
          $(this).remove();
        });
      });
    })
    .fail(function () {
      alert('Erro ao recuperar profissionais. Por favor, dentro de alguns instantes, tente recarregar a página.')
    });

  function initDataTable() {
    $table.DataTable({
      "language": {
        "sEmptyTable": "Nenhuma solicitação cadastrada",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ solicitações",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 solicitações",
        "sInfoFiltered": "(Filtrados de _MAX_ solicitações)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhuma solicitação encontrada",
        "sSearch": "Pesquisar",
        "oPaginate": {
          "sNext": "Próximo",
          "sPrevious": "Anterior",
          "sFirst": "Primeiro",
          "sLast": "Último"
        },
        "oAria": {
          "sSortAscending": ": Ordenar colunas de forma ascendente",
          "sSortDescending": ": Ordenar colunas de forma descendente"
        }
      }
    });
  }
});