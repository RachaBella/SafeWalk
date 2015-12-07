// SERVER-SIDE JAVASCRIPT

// REQUIREMENTS //


var express = require("express"),
    app = express(),
    path = require("path"),
    bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
    db = require('./models'),
    session = require('express-session');
    
app.set('view engine', 'ejs');
// app.engine('html', ejs.renderFile); 
// app.set('view engine', 'html');
app.use("/static", express.static("public"));
// body parser config to accept our datatypes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require('dotenv').load();

app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'SuperMegaGegaCookieSecret',
  cookie: { maxAge: 6000000 }
}));

// My accountSid and authToken from twilio.com/user/account
var accountSid = process.env.accountSid;
var authToken = process.env.authToken;
var twilio = require("./node_modules/twilio/lib");
var client = new twilio.RestClient(accountSid, authToken);
 

app.get("/", function (req ,res) {
	res.render('index');
});


app.post("/send_sms", function (req, res) {
	console.log('the req is', req.body.relativesPhoneNumber);
	client.messages.create({
	    body: "Hey Dear! I am "+ req.body.username+ " and i am home already :)",
	    to: ""+ req.body.relativesPhoneNumber,
	    from: "+18582812932"
	}, function(err, message) {
		if(err){
			console.log("sorry an error occured", err.message);
		}
	    process.stdout.write(message.sid);
	    res.send("Message sent successfully");
		});
});

app.get('/logout', function (req, res) {
	req.session.user = null;
	req.session.userId = null;
	res.json(req.session.user);
	
});

app.post("/login", function (req, res) {
	db.User.authenticate (req.body.password, req.body.email, function (error, user) {
		if(error =="wrong email") {
			res.send("User doesn't exist")
		}else if (error == "Error: incorrect password") {
			res.send("Incorrect Password")
		}else if(user!==null) {
			req.session.userId = user._id;
			req.session.user = user;
			console.log("session verification :", req.session.userId )
			res.json(user);
		}

	});
})

app.post("/users", function (req, res) {
	user = req.body;
	console.log('body:', user);
	db.User.createSecure(user.username, user.email, user.password, user.location.latitude, user.location.longitude, user.number, function (error, newUser) {
		if(error) {
			console.log("error", error);
		}
		
			req.session.userId = newUser._id;
			req.session.user = newUser;
			console.log("yeaah success !!")
			res.send(newUser);
		
		
	});
});

app.get("/current_user", function (req, res) {
	var user = req.session.user;
	//console.log("the session is:", req.session.user);
	res.json({user : req.session.user});
});

app.get("/logout", function (req, res) {

});

app.post("/login", function (req, res) {


});


app.listen(process.env.PORT || 3000, function () {
	console.log("listening on port 3000 ... success :)");
})