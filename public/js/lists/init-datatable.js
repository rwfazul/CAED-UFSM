function initDataTable($table, nameSing, namePlural) {
  $table.DataTable({
    language: {
      sEmptyTable: `Nenhum registro de ${nameSing} cadastrado`,
      sInfo: `Mostrando de _START_ até _END_ de _TOTAL_ ${namePlural}`,
      sInfoEmpty: `Mostrando 0 até 0 de 0 ${namePlural}`,
      sInfoFiltered: `(Filtrados de _MAX_ ${namePlural})`,
      sInfoPostFix: "",
      sInfoThousands: ".",
      sLengthMenu: "_MENU_ resultados por página",
      sLoadingRecords: "Carregando...",
      sProcessing: "Processando...",
      sZeroRecords: `Busca não retornou resultados`,
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
  // Datatable select issues fix (init and on click)
  $('select').material_select();
  $(".dropdown-content.select-dropdown li").on("click", function() {
    var that = this;
    setTimeout(function() {
      if ($(that).parent().parent().find('.select-dropdown').hasClass('active')) {
        // $(that).parent().removeClass('active');
        $(that).parent().parent().find('.select-dropdown').removeClass('active');
        $(that).parent().hide();
      }
    }, 100);
  });
}