$(function() {
  canvas.width = document.body.clientWidth + 10;
  $("#makepdf").on('click', function() {
    var pathname = window.location.pathname; 
    var parts = pathname.split('/');
    var id = moment(new Date()).format('DD-MM-YYYY_HH-mm-ss');
    html2canvas($("#canvas")[0], {
      onrendered: function(canvas) {
        var img = canvas.toDataURL('image/png')
        var doc = new jsPDF('l', 'mm');
        doc.addImage(img, 'PNG', 10, 10);
        doc.save(`${parts[2]}-${parts[3]}-${id}.pdf`);
      }
    });
  });
});