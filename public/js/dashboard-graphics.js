$(function () {

var data_chart_month = {
    labels: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 
    'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    series: [
      [0, 12, 20 , 10, 8, 18],
      [5, 2, 4, 2, 0, 2]
    ]
  };
  
  var options_chart_month = {
    width: 1000,
    height: 250
  };

  new Chartist.Line('#chart_month', data_chart_month, options_chart_month);

  var data_chart_type = {
    labels: ['Psicológico', 'Psicopedagógico', 'Orientação Profissional'],
    series: [
      [50, 20, 15],
      [35, 10, 22]
    ]
  };
  
  var options_chart_type = {
    seriesBarDistance: 15,
    width: 500,
    height: 250
  };
  
  new Chartist.Bar('#chart_type', data_chart_type, options_chart_type);

});