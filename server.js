let cheerio = require("cheerio");
let express = require("express");
let axios = require("axios");
let expHand = require("express-handlebars");
let mongoose = require("mongoose");

var logger = require("morgan");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";

mongoose.connect(MONGODB_URI);
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });