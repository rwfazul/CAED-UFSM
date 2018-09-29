var express = require('express'),
	app = express();
var extract = require('./services/extract-sheets');
var request = require('request');
var bodyParser = require('body-parser');

// view engine setup
app.set('view engine', 'ejs');
app.set('views', 'admin');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('resources'));
app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*"); // TODO: change to app domain
	res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
	next();
});

/* TODO: MODULARIZAR EM ARQUIVO DE ROTAS SEPARADO */
app.get('/admin', function (req, res) {
	res.render('index');
});

app.get('/admin/extract-sheets', function (req, res) {
	extract(function (result, error) {
		if (error) result.render('table-extract-sheets', { data: error });
		else {
			res.render('table-extract-sheets', { data: result });
		}
	});
});

app.get('/admin/dashboard', function (req, res) {
	res.render('dashboard');
});

app.get('/admin/agenda', function (req, res) {
	extract(function (result, error) {
		if (error) result.render('agenda', { data: error });
		else {
			res.render('agenda', { data: result });
		}
	});
});

app.get('/admin/solicitacoes', function (req, res) {
	res.render('agenda');
});

app.get('/admin/logout', function (req, res) {
	res.render('index');
});

app.post('/admin/login', function (req, res) {
	var usuario = req.body['usuario'];
	var senha = req.body['senha'];
	if (usuario == "admin" && senha == "admin") {
		res.render("dashboard");
	}
	//como mudar url após encaminhar para página?	
})

/* TODO: MODULARIZAR EM ARQUIVO DE ROTAS SEPARADO */
app.post('/authenticate', function (req, res) {
	var apiUrl = 'https://portal.ufsm.br';
	var loginRequest = {
		appName: 'UFSMDigital',
		deviceId: '',
		deviceInfo: '',
		login: '',
		messageToken: '',
		senha: ''
	}

	loginRequest.login = req.body['login'];
	loginRequest.senha = req.body['senha'];

	var clientServerOptions = {
		uri: apiUrl + '/mobile/webservice/generateToken',
		body: JSON.stringify(loginRequest),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8'
		}
	}

	var loginMsgs = {
		genericError: 'error',
		requestFail: 'request error',
		loginFail: 'credentials error',
		loginSuccess: 'login success',
		responseFormatError: 'error at parsing response',
		unableToValidate: 'unable to check response from server at ' + clientServerOptions.uri
	}

	request(clientServerOptions, function (error, response) {
		var responseData = {
			status: 200,
			msg: loginMsgs.genericError,
			originalResponse: '',
			authenticated: false
		};
		var authInfo = {};

		if (error) responseData.msg = loginMsgs.requestFail;
		else if (response) {
			try { authInfo = JSON.parse(response.body); }
			catch (e) { responseData.msg = loginMsgs.responseFormatError; }

			responseData.originalResponse = authInfo.mensagem;

			if ('error' in authInfo) {
				responseData.msg = authInfo.error ? loginMsgs.loginFail : loginMsgs.success;
				responseData.authenticated = !authInfo.error;
			} else responseData.msg = loginMsgs.unableToValidate;
		}
		res.json(responseData);
	});
});


app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
	console.log('Express server listening on port ' + app.get('port'));
});
