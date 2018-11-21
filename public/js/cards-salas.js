$(function() {

	const cards = $('#cards-salas');
	const apiSalas = '/api/salas/';

	(function getSalas() {
		var salaUrl = window.location.pathname + '/sala/';
    	$.getJSON(apiSalas)
	      .done(function(salas) {
	        $.each(salas, function(i, sala) {
	        	var subPath = encodeURIComponent(sala['nome'].replace(/\s+/g, '-').toLowerCase());
	        	cards.append( createCard(sala, salaUrl + subPath) );
	        });
 			$("#loader-events").css('display', 'none');
	      })
	      .fail(function() {
	        alert('Erro ao recuperar as salas. Por favor, dentro de alguns instantes, tente recarregar a página.')
	      });		
	})();

	function createCard(sala, path) {
		return (`
		    <div class="col s12 m4">
		      <div class="sala card cyan darken-1 z-depth-3">
		        <div class="card-content blac white-text">
		          <span class="card-title">${sala.nome}</span>
		        </div>
		        <div class="card-action right-align">
		          <form method="POST" action="${path}"> 
		            <input type="hidden" name="id" value="${sala.id}" />
		            <input type="hidden" name="nome" value="${sala.nome}" />		          
		          	<button class="white-text link">Ver agenda <i class="material-icons">send</i></button>
		          </form>
		        </div>
		      </div>
		    </div>
		`);
	}

});