var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = 3000;
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytnewsdb";

mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// ROUTES
// A GET route for scraping the website
app.get("/scrape", function (req, res) {

	axios.get("https://www.nytimes.com/section/world").then(function (response) {
		var $ = cheerio.load(response.data);

		$("#stream-panel").find("li").each(function (i, element) {
			// Save an empty result object
			console.log(element);
			var result = {};

			result.title = $(element).find("h2").text()
			result.link = $(element).find("a").attr("href");
			result.summary = $(element).find("p").text()

			console.log(result);

			// Create a new Article 
			db.Article.create(result)
				.then(function (dbarticle) {
					console.log(dbarticle);
				})
				.catch(function (err) {
					console.log(err);
				});
		});

		res.send("Scrape Complete");
	});
});
// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
	// Grab every document in the Articles collection
	db.Article.find({})
		.then(function (dbArticle) {
			res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
});

//specific Article by id, populate it with it's note
app.get("/articles/:id", function (req, res) {

	db.Article.findOne({ _id: req.params.id })
		//  notes 
		.populate("note")
		.then(function (dbArticle) {
			res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function (req, res) {
	// Create a new note 
	db.Note.create(req.body)
		.then(function (dbNote) {

			return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
		})
		.then(function (dbArticle) {
			res.json(dbArticle);
		})
		.catch(function (err) {
			res.json(err);
		});
});

app.listen(PORT, function () {
	console.log("App running on port " + PORT + "!");
});



