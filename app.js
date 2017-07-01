var App = require("ms-core");
var config = require("./config.js");
var cookieParser = require('cookie-parser')
var request = require("superagent");

App.init(config);

require("./db.js");

App.Express.use(cookieParser());

App.Express.use("/api/*", function (req, res) {
	var startIndex = 2;
	var urlParts = req.originalUrl.split("/");
	var application = urlParts[startIndex];
	var applicationRoute = "https://uptiverse-" + application + ".herokuapp.com";
	var route = urlParts.slice(startIndex, urlParts.length).reduce(function(url, part) { return url + "/" + part; }, "");

	var finalRoute = applicationRoute + route;

	var token = req.cookies.id_token;

	request(req.method,finalRoute)
 		.send(req.body)
		.set('Authorization', "JWT " + token)
 		.end(function(err, response){
	     if (err || !response.ok) {
	       res.send(response.text);
	     } else {
	       res.send(response.body);
	     }
	   });
});
