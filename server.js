var express = require('express'),
    app = express();
var extract = require('./services/extract-sheets');
// view engine setup
app.set('views', 'admin');
app.set('view engine', 'ejs');

app.use(express.static('admin'));
app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.get('/admin', function(req, res) {
	extract(function(result, error){
		if (error) res.render('index', { data: error });
		else {
			console.log(result[1]);
			res.render('index', { data: result });
		}
	});
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});