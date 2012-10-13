// Utilities.
var util = require("util");
var url = require("url");
var _ = require("underscore");

// Config.
var config = require("config");

// Eyes.
var eyes = require("eyes");

var inspect = eyes.inspector({
	stream: null
});

// Pusher API
var Pusher = require("node-pusher");

var pusher = new Pusher({
	appId: config.pusher.appId,
	key: config.pusher.key,
	secret: config.pusher.secret
});

// Express.js
var express = require("express");
var app = express();

app.use(express["static"](__dirname + "/www"));
app.use(express.bodyParser());
app.use(app.router);

// Set up error handler.
app.use(function(err, req, res, next) {
	console.error(err.stack);
	next(err);
});

// Request.
var request = require("request");

// App.
app.get("/", function(req, res) {
	res.redirect("map.html");
});

app.post("/api/points", function(req, res) {
	var lat = req.body.lat;
	var lng = req.body.lng;
	var title = req.body.title;

	res.contentType("application/json");

	if (!(lat && lng && title)) {
		var error = {
			name: "ApiError",
			message: "POST: /api/points - lat, lng and title must be specified."
		};

		console.log(inspect(error));
		res.send(400, error);
	}

	var message = {
		lat: lat,
		lng: lng,
		title: title
	};

	// Push the message.
	pusher.trigger("my_app", "my_points", message);

	console.log("title: " + title);

	// Feedback input parameters.
	var response = {
		lat: lat,
		lng: lng,
		title: title
	};

	console.log(inspect(response));
	res.send(response);
});

// Start app.
var port = process.env.port || 3000;

app.listen(port);

// Started.
console.log(util.format("--> started on port %d.", port));
