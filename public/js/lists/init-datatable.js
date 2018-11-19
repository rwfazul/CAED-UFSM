function initDataTable($table, nameSing, namePlural) {
  var table = $table.DataTable({
    responsive: true,
    dom: 'Bfrtip',
    buttons: [
        { extend: 'colvis', text: '<i class="material-icons">visibility</i>  Visibilidade' },
                { extend: 'print', exportOptions: { columns: [ ':visible' ] }, text: '<i class="material-icons">print</i> Imprimir' },        
        { extend: 'copyHtml5', exportOptions: { columns: [ ':visible' ] }, text: '<i class="material-icons">content_copy</i>  Copiar' },
        { extend: 'csvHtml5', exportOptions: { columns: [ ':visible' ] }, text: '<i class="material-icons">view_week</i> CSV' },
        { extend: 'pdfHtml5', exportOptions: { columns: [ ':visible' ] }, text: '<i class="material-icons">picture_as_pdf</i> PDF' }, 
    ],
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
      },
      buttons: {
        copyTitle: 'Dados copiados!',
        copySuccess: {
            _: '%d linhas copiadas',
            1: '1 linha copiada'
        }
      }
    }
  });


  table.buttons().container()
    .appendTo( $('.col-sm-6:eq(0)', table.table().container()) );

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