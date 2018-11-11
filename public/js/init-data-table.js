function initDataTable($table, nameSing, namePlural) {
  $table.DataTable({
    language: {
      sEmptyTable: `Nenhuma ${nameSing} cadastrada`,
      sInfo: `Mostrando de _START_ até _END_ de _TOTAL_ ${namePlural}`,
      sInfoEmpty: `Mostrando 0 até 0 de 0 ${namePlural}`,
      sInfoFiltered: `(Filtrados de _MAX_ ${namePlural})`,
      sInfoPostFix: "",
      sInfoThousands: ".",
      sLengthMenu: "_MENU_ resultados por página",
      sLoadingRecords: "Carregando...",
      sProcessing: "Processando...",
      sZeroRecords: `Nenhuma ${nameSing} encontrada`,
      sSearch: "Pesquisar",
      oPaginate: {
        sNext: "Próximo",
        sPrevious: "Anterior",
        sFirst: "Primeiro",
        sLast: "Último"
      },
      oAria: {
        sSortAscending: ": Ordenar colunas de forma ascendente",
        sSortDescending: ": Ordenar colunas de forma descendente"
      }
    }
  });
}