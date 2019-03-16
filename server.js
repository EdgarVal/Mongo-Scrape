let cheerio = require("cheerio");
let express = require("express");
let axios = require("axios");
let expHand = require("express-handlebars");
let mongoose = require("mongoose");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";

mongoose.connect(MONGODB_URI);
