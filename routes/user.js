var express = require('express');
var router = express.Router();

router.post('/authenticate', function (req, res) {
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

module.exports = router;