var express = require('express'),
    app = express();
var extract = require('./services/extract-sheets');
var request = require('request');
var bodyParser = require('body-parser');

// view engine setup
app.set('views', 'admin');
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json()); 

app.use(express.static('admin'));
app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // TODO: change to app domain
    res.header("Access-Control-Allow-Headers", "Content-Type, X-Requested-With");
    next();
});

/* TODO: MODULARIZAR EM ARQUIVO DE ROTAS SEPARADO */
app.get('/admin', function(req, res) {
	extract(function(result, error){
		if (error) res.render('index', { data: error });
		else {
			res.render('index', { data: result });
		}
	});
});

/* TODO: MODULARIZAR EM ARQUIVO DE ROTAS SEPARADO */
app.post('/authenticate', function(req, res) {
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
    	    catch(e) { responseData.msg = loginMsgs.responseFormatError; }

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