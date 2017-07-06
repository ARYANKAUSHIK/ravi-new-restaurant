var express = require('express'),
	partials = require('express-partials'),
	app = express(),
	routes = require('./routes'),
	csrf = require('csurf'),
	util = require('./middleware/utilities'),
	log = require('./middleware/log'),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	validator = require('express-validator'),
	flash = require('connect-flash'),
  bodyParser = require('body-parser'),
	config = require('./config/dev')
;

app.set('view engine', 'ejs');
app.set('view options', {defaultLayout: 'layout'});

app.use(partials());
app.use(express.static(__dirname + '/static', { maxage: '30d' }));
app.use(log.logger);
app.use(validator());
app.use(cookieParser(config.secret));
app.use(session({
	secret: config.secret,
	saveUninitialized: false,
	resave: false,
        cookie: { maxAge: 30 * 24 * 60 * 1000 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(csrf());
app.use(util.csrf);
app.use(flash());
app.use(util.authenticated);
app.use(util.templateRoutes);
app.use(util.templateApi);
app.use(util.defaults);
app.use(util.query);

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});
//routes
app.get('/', routes.index);

app.get('/booking', routes.booking);
app.get('/register', routes.register);
app.get('/locator', routes.locator);
// app.get('/logout', routes.logout);
app.post('/', routes.doLogin);
app.post('/register',routes.doRegister);

app.get('/error', function(req, res, next){
 	next(new Error('A contrived error'));
});

app.listen(config.port);
console.log("App server running on port "+ config.port);
