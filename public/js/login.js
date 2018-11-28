$(function() {  

  var $formLogin   = $('#form-login');
  var $formError   = $formLogin.find('#form-error');
  var $btnLogin    = $formLogin.find('#btn-login');
  var $password    = $formLogin.find('#password');
  var $loginText   = $('#login-text')
  var $loginLoader = $("#login-loader")

  $formLogin.submit(function(e) {
    $btnLogin.prop('disabled', true);
    $loginText.hide();
    $loginLoader.css('display', 'block');
    var form = $(this);
    e.preventDefault(); 
    $.ajax({
      type:  form.attr('method'),
      url: form.attr('action'),
      data: form.serialize(),
      success: function(data) {
        window.location.href = "/admin/dashboard";
      },
      error: function(xhr, status, error) {
        var data = JSON.parse(xhr.responseText);
        $password.val('');
        $formError.text(`* ${data['message']}`);
        var toastData = {
          heading: 'Erro',
          text: data['tip'] ? data['tip'] : data['message'],
          showHideTransition: 'slide',
          icon: 'error'
        };
        $.toast(toastData);
      },
      complete: function(data) {
        $btnLogin.prop('disabled', false);
        $loginLoader.css('display', 'none');
        $loginText.show();
      }
    });
  });

});