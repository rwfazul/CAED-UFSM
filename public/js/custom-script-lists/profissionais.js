$(function () {
  var $table = $('#table-profissionais');
  var $modal = $('#profissionais');

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
        $modal.append(
          "<div class='modal' id='" + profissional.id + "'>"
          + "<div class='modal-content'><div class='col s11'><h5>Horários Livres " + profissional.nome + "</h5></div>"
          + "<div class='col s1 right'><a href='#!' class='modal-close waves-effect waves-green btn-floating light-blue lighten-1 white-text'>"
          + "<i class='material-icons'>close</i></a></div>"
          + "</div></div>");


        $('.modal').modal(); 
        initDataTable();
        $('#' + profissional.id + '> .modal-content').append(tableAvailableHours(profissional.horarios));
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
        "sEmptyTable": "Nenhum profissional cadastrado",
        "sInfo": "Mostrando de _START_ até _END_ de _TOTAL_ profissionais",
        "sInfoEmpty": "Mostrando 0 até 0 de 0 profissionais",
        "sInfoFiltered": "(Filtrados de _MAX_ profissionais)",
        "sInfoPostFix": "",
        "sInfoThousands": ".",
        "sLengthMenu": "_MENU_ resultados por página",
        "sLoadingRecords": "Carregando...",
        "sProcessing": "Processando...",
        "sZeroRecords": "Nenhum profissional encontrado",
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