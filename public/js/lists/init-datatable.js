function initDataTable($table, nameSing, namePlural) {
  $.fn.dataTable.moment('DD/MM/YYYY');
  var table = $table.DataTable({
    responsive: true,
    ordering: true,
    order: [[ 0, "desc" ]],
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

  var buttons = new $.fn.dataTable.Buttons(table, {
    buttons: [
      { extend: 'colvis', text: 'Visibilidade <i class="left material-icons">visibility</i>' },
      { extend: 'print', exportOptions: { columns: [ ':visible' ] }, text: 'Imprimir <i class="left material-icons">print</i>' },        
      { extend: 'copyHtml5', exportOptions: { columns: [ ':visible' ] }, text: 'Copiar <i class="left material-icons">content_copy</i>' },
      { extend: 'csvHtml5', exportOptions: { columns: [ ':visible' ] }, text: 'CSV <i class="left material-icons">view_week</i>' },
      { extend: 'pdfHtml5', exportOptions: { columns: [ ':visible' ] }, text: 'PDF <i class="left material-icons">picture_as_pdf</i>' }, 
    ]
  }).container().appendTo($('#table-buttons'));

  // Datatable select issues fix (init and on click)
  $('select').material_select();
  $("select").change(function() {
    var t = this;
    var content = $(this).siblings('ul').detach();
    setTimeout(function () {
        $(t).parent().append(content);
        $("select").material_select();
    }, 200);
  });
  /*$(".dropdown-content.select-dropdown li").on("click", function() {
    var that = this;
    setTimeout(function() {
      if ($(that).parent().parent().find('.select-dropdown').hasClass('active')) {
        // $(that).parent().removeClass('active');
        $(that).parent().parent().find('.select-dropdown').removeClass('active');
        $(that).parent().hide();
      }
    }, 100);
  });*/
}