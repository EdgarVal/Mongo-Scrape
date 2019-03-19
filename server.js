let cheerio = require("cheerio");
let express = require("express");
let axios = require("axios");
let mongoose = require("mongoose");
let logger = require("morgan");
let db = require("./models");

mongoose.Promise = global.Promise;
let MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScrape";

mongoose.set("useCreateIndex", true);
mongoose.connect(MONGODB_URI, {useNewUrlParser: true});
let PORT = process.env.PORT || 3000;

// Initialize Express
let app = express();
// Configure middleware
let expHand = require("express-handlebars");
app.engine("handlebars", expHand({ defaultLayout: "main" }));
app.set("view engine", "handlebars")
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

//Get route for scraping website
app.get("/scrape", function(req, res) {
    axios.get("https://bleacherreport.com/tampa-bay-buccaneers").then(function(response) {
        let $ = cheerio.load(response.data);
        // console.log(response.data);
        $(".articleSummary").each(function(i, element) {
            let result = {};
            let summary = $(element).find("p").text();
            if (!summary) {
                console.log("no sum" + result);
                result.summary = null;            
            } else {
                result.summary = summary;
            }
            result.title = $(element).find("h3").text();
            result.link = $(element).find("a").attr("href");
            console.log("this--" + result.title);
            console.log("that--" + result.summary);
            console.log("here--" + result.link);
            db.Article.create(result).then(function(err, dbArticle) { 
                if(err) {
                console.log(err);
            } else {
                console.log(dbArticle);
            }  
            });
        });
        res.send("Scrape Complete");
    });
});

app.get("/articles", function (req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});//working

app.get("/saved", function (req, res) {
    db.Article.find({}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/null", function(req, res) {
    db.Article.find({summary:null}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/summary", function(req, res) {
    db.Article.find({summary:{$ne: null}}).then(function(dbArticle) {
        res.json(dbArticle);
    }).catch(function(err) {
        res.json(err);
    });
});

app.get("/", function(req, res) {
    db.Article.find({}, function(err, data) {
        let handlebarObject = {
            articles: data
        };
        res.render("index", handlebarObject);
    })
})

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});