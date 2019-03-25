const cheerio = require("cheerio");
const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const logger = require("morgan");
const db = require("./models");
const bodyParser = require("body-parser");

mongoose.Promise = global.Promise;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";

mongoose.set("useCreateIndex", true);
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
// Configure middleware
const expHand = require("express-handlebars");
app.engine("handlebars", expHand({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Global variables-------------------------------------
let artObject;

//-----------------------------------------------------
//Get route for scraping website
app.get("/scrape", function(req, res) {
    axios.get("https://bleacherreport.com/tampa-bay-buccaneers").then(function(response) {
        const $ = cheerio.load(response.data);
         console.log(response.data);
        $(".articleContent").each(function(i, element) {
            let result = {};
            let summary = $(element).find("p").text();
            if (!summary) {
                // console.log("no sum" + result);
                result.summary = null;            
            } else {
                result.summary = summary;
            }
            result.title = $(element).find("h3").text();
            result.link = $(element).find(".articleTitle").attr("href");
            // console.log("this--" + result.title);
            // console.log("that--" + result.summary);
            // console.log("here--" + result.link);
            db.Article.create(result).then(function(err, dbArticle) { 
                if(err) {
                console.log(err);
            } else {
                console.log(dbArticle);
            }  
            });
        });
        res.redirect("/articles");
        // res.send("Scrape Complete");
    });
});//--------working

app.get("/articles", function (req, res) { //shows all articles from scrape
    db.Article.find({}).sort({timestamp: 1}).then(function(dbArticle) {
        artObject = {article: dbArticle};
        res.render("index", artObject);
        // res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});//--------working

app.get("/saved", function (req, res) { //shows all the users saved articles
    db.Article.find({saved: true}).then(function(dbArticle) {
        artObject = {article: dbArticle};
        res.render("saved", artObject);
        // res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/null", function(req, res) { //shows all articles with no summary
    db.Article.find({summary:null}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});//--------working

app.get("/summary", function(req, res) { //shows all articles with a summary
    db.Article.find({summary:{$ne: null}}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});//--------working

app.get("/", function(req, res) { //route for homepage
    db.Article.find({}).sort({timestamp: 1}).then((dbArticle) => {
        if(dbArticle.length == 0) {
            res.render("index");
        } else {
            res.redirect("/articles");
        }
    }).catch((err) => {
        res.json(err);
    })
})

app.post("/notes/save/:id", function(req, res) {
    let newNote = new newNote({
        body: req.body.text,
        title: req.params.title
    });

})

//save an article 
app.put("/article/:id", (req, res) => {
    let id = req.params.id;
    console.log("this is " + id);
    db.Article.findByIdAndUpdate(id, {$set: {saved: true}}).then((dbArticle) => {
        console.log(" article saved");
        res.json(dbArticle);
    }).catch((err) => {
        res.json(err);
    });
});

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});