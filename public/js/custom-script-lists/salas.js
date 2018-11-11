$(function () {
  var $table = $('#table-salas');
  var $modal = $('#salas');

  $.getJSON("/api/salas")
    .done(function (salas) {
      $.each(salas, function (i, sala) {
        $table.append(
          "<tr>"
          + "<td>" + sala.nome + "</td>"
          + "<td><a class='modal-trigger waves-effect waves-green btn-flat' href='#" + sala.id + "'>Clique aqui <i class='left material-icons'>search</i></a></td>"
          + "</tr>"
        );
        $modal.append(
          "<div class='modal' id='" + sala.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + sala.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");


        $('.modal').modal(); 
        initDataTable();
        $('#' + sala.id + '> .modal-content').append(tableAvailableHours(sala.horarios));
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
        "sEmptyTable": "Nenhuma sala cadastrada",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ salas",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 salas",
        "sInfoFiltered": "(Filtrados de _MAX_ salas)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhuma sala encontrada",
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