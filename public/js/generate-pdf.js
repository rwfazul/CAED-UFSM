$(function() {
  canvas.width = document.body.clientWidth;
  $("#makepdf").on('click', function() {
    var pathname = window.location.pathname; 
    var parts = pathname.split('/');
    var id = moment(new Date()).format('DD-MM-YYYY_HH-mm-ss');
    html2canvas($("#canvas")[0], {
      onrendered: function(canvas) {
        var img = canvas.toDataURL('image/png');
        var doc = new jsPDF('l', 'mm', 'a4');
        var width = doc.internal.pageSize.getWidth();
        var height = doc.internal.pageSize.getHeight();
        doc.addImage(img, 'PNG',  0, 0, width, height);
        doc.save(`${parts[2]}-${parts[3]}-${id}.pdf`);
      }
    });
  });
});