$(function () {
  $('select').material_select();

  function createGraphType(solicitacoes, encaminhamentos) {
    var data_chart_type = {
      labels: ['Psicológico', 'Psicopedagógico', 'Orientação Profissional'],
      series: [solicitacoes, encaminhamentos]
    };
    var options_chart_type = {
      seriesBarDistance: 15,
      width: 500,
      height: 250
    };

    new Chartist.Bar('#chart_type', data_chart_type, options_chart_type);
  }

  function createGraphMonth(solicitacoes, encaminhamentos) {
    var data_chart_month = {
      labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
        'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
      series: [solicitacoes, encaminhamentos]
    };
    var options_chart_month = {
      width: 1000,
      height: 250
    };

    new Chartist.Line('#chart_month', data_chart_month, options_chart_month);
  }

  function getCountType(data) {
    var count = Array(3).fill(0);
    $.each(data, function (i, doc) {
      if (doc.tipoAtendimento == "Psicológico") {
        count[0]++;
      } else if (doc.tipoAtendimento == "Psicopedagógico") {
        count[1]++;
      } else if (doc.tipoAtendimento == "Orientação Profissional") {
        count[2]++;
      }
    });
    return count;
  }

  function getCountMonth(data) {
    var count = Array(12).fill(0);
    $.each(data, function (i, doc) {
      var month = parseInt(moment(doc.timestamp).format('M')) - 1;
      count[month]++;
    });
    return count;
  }

  function createGraphs(year) {
    var t1 = $.getJSON(`/api/solicitacoes/getcount/${year}`);
    var t2 = $.getJSON(`/api/encaminhamentos/getcount/${year}`);
    $.when(t1, t2).done(function (d1, d2) {
      createGraphType(getCountType(d1[0]), getCountType(d2[0]));
      $("#loader-chart-type").css('display', 'none');
      createGraphMonth(getCountMonth(d1[0]), getCountMonth(d2[0]));
      $("#loader-chart-month").css('display', 'none');
    })
      .fail(function () {
        alert(`Erro ao recuperar os dados. Por favor, dentro de alguns instantes, tente recarregar a página.`)
      });
  }

  function loaderGraphics(){
    $("select option:selected").each(function() {
      $("#chart_type").empty();
      $("#loader-chart-type").css('display', 'block');
      $("#chart_month").empty();
      $("#loader-chart-month").css('display', 'block');
      createGraphs($(this).text());
    });
  }
  $("#year").change(function (){
    loaderGraphics();
  });

  loaderGraphics();

});