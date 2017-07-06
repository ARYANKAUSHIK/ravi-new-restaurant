var config = require('../config/dev');
var Client = require('node-rest-client').Client;
var client = new Client();
var momemt = require('moment');
//login
module.exports.index = index;
module.exports.doLogin = doLogin; 
module.exports.booking = booking; 
//register
module.exports.register = register; 
module.exports.doRegister = doRegister; 

module.exports.locator = locator;

function index(req,res){
	res.render('index', {
		layout: 'layout',
		title: 'Credit Login / Register Form ',
		description: 'Restaurant Booking ',
		keywords: 'Restaurant Login / Register Form Responsive Widget,Restauant Login form widgets, Sign up Web forms , Login signup Responsive web form',
		css: [config.cdn.path+"/css/style-index.css"],
		scripts: [config.cdn.path+"/js/jquery.magnific-popup.js"],
		hasErrors: false,
		messages: null
	});
};

function register(req,res){
	res.render('register', {
		layout: 'layout',
		title: 'Restaurant Register ',
		description: 'Restaurant Booking ',
		keywords: 'Restaurant Booking / Register Form Responsive Widget,Restaurant Booking, Sign up Web forms , Login signup Responsive web form',
		css: null,
		scripts: null,
		hasErrors: false,
			messages: null,
			data : null
	});
};

function locator(req,res){
	res.render('locator', {
		layout: 'layout',
		title: 'Restaurant Reservation Form ',
		description: 'Restaurant Booking ',
		keywords: 'Restaurant Booking / Register Form Responsive Widget,Restaurant Booking, Sign up Web forms ,Login signup Responsive web form'
	});
};

function booking(req,res){
	res.render('booking', {
		layout: 'layout',
		title: 'Restaurant Reservation Form ',
		description: 'Restaurant Booking ',
		keywords: 'Restaurant Booking / Register Form Responsive Widget,Restaurant Booking, Sign up Web forms,Login signup Responsive web form'
	});
};
function doLogin(req,res){ 
	req.checkBody('mobile', 'Mobile number is required').
        notEmpty().isInt().withMessage('Please enter a valid mobile number, it can only have numbers');
    req.checkBody('password', 'Password is required').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
            console.log('error -> '+ error.msg);
        });
        req.flash('error', messages);
        res.render('index', {
            layout: 'layout',
            title: 'Login',
						description: 'Restaurant',
						keywords: 'Restaurant',
            hasErrors: messages.length > 0,
            messages: errors
        }); 
    }else{
        var meCallback = function(error, data){
            if(data && data.success && data.success === true){
                if (req.session.oldUrl) {
                    var oldUrl = req.session.oldUrl;
                    req.session.oldUrl = null;
                    res.redirect(oldUrl);
                } else {
                    res.redirect('/locator');
                }
            }else{
                console.log(error);
                console.log(data);

                var msg = [];
                if (error && error.message) {
                    msg.push({msg: error.message});
                    req.flash('error', messages);
                }
                res.render('index', {
										layout: 'layout',
										title: 'Login',
										description: 'Restaurant',
										keywords: 'Restaurant',
                    hasErrors: msg.length > 0,
                    messages: msg
                });
            }
        }
        var args = {
            data: { mobile: parseInt(req.body.mobile),
							password:req.body.password, apiKey:config.api.key },
            headers: { "Content-Type": "application/json" }
        };
        client.post(config.api.url+ "/login", args,
						function (data, response) {
            console.log("data "+ JSON.stringify(data));
            if (data && data.success == true){
                console.log("data "+ data);
                req.session.isAuthenticated = true;
                req.session.user = data;
                console.log(" >>> ", response);
                meCallback(null, data);
            }else{
								console.log("----null---");
                meCallback(data, null);
            }
        });
    }
}; 
function doRegister(req, res){
    req.checkBody('name', '* Name is required').notEmpty();
    req.checkBody('mobile', '* Mobile number is required').
        notEmpty().isInt().withMessage('* Please enter a valid mobile number, it can only have numbers');
    req.checkBody('password', '* Password is required').notEmpty();
    req.checkBody('email', '* Enter valid Email').notEmpty().isEmail();
    req.checkBody('confirm_password', '* Confirm password is required and it should be same as the password').notEmpty();
    var errors = req.validationErrors();

    var sData= {name: req.body.name, email: req.body.email, mobile: req.body.mobile, password: req.body.password, confirmpass: req.body.confirm_password};
		console.log(sData);

		if (errors) {
        var messages = [];
        errors.forEach(function(error) {
            messages.push(error.msg);
            console.log('error -> '+ error.msg);
        });
        console.log(req.body.password);
        console.log(req.body.confirm_password);
        console.log(req.body.password === req.body.confirm_password)
        if(req.body.password !== req.body.confirm_password){
            console.log("password and confirm_password doesnot matched")
            messages.push('Password and confirm password does not match');
        }
        req.flash('error', messages);
        res.render('register', {
            layout: 'layout',
            title: 'Register',
						description: 'Restaurant',
						keywords: 'Restaurant',
            hasErrors: messages.length > 0,
            messages: errors,
            data: sData
        });
    }else{
        var meCallback = function(error, data){
            var messages =[];
            var mess = 'Account created successfully';
            messages.push({msg: mess});
            if(data && data.success && data.success === true){
							console.log(data);
                if (req.session.oldUrl) {
                    var oldUrl = req.session.oldUrl;
                    req.session.oldUrl = null;
                    res.redirect(oldUrl);
                } else {
                    res.render('index', {
                        layout: 'layout',
                        title: 'Login',
												description: 'Restaurant',
												keywords: 'Restaurant',
                        hasErrors: 0,
                        messages: messages
                    });
                }
            }else{
                console.log(error);
                console.log(data);
                var msg = [];
                if (error && error.error) {
                    if(error.error === 'Value for [mobile] must be greater than or equal to 1000000000.'){
                        var masg = 'Please enter a valid mobile number';
                        msg.push({msg: masg});
                        req.flash('error', error);
                    }else{
                        msg.push({msg: error.error});
                        req.flash('error', error);
                    }
                }
                res.render('register', {
                    layout: 'layout',
                    title: 'Register',
										description: 'Restaurant',
										keywords: 'Restaurant',
                    hasErrors: msg.length > 0,
                    messages: msg,
                    data: sData
                });
            }
        }
        var args = {
            data: {name: req.body.name, email: req.body.email, mobile: parseInt(req.body.mobile), password: req.body.password, confirm_password: req.body.confirm_password, apiKey:  config.api.key},
            headers: { "Content-Type": "application/json" }
        };
        console.log(JSON.stringify(args.data));
        console.log('url-->'+config.api.url+ "/signUp");
        client.post(config.api.url+ "/signUp", args, function (data, response) {
            console.log("data "+ JSON.stringify(data));
            if (data && data.success == true){
                console.log("data "+ data);
                //req.session.isAuthenticated = true;
                //req.session.user = data;
                console.log(" >>> ", response);
                meCallback(null, data);
            }else{
								console.log("error");
                meCallback(data, null);
            }
        });
    }
};
