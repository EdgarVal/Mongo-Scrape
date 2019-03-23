// $(() => {
// const cheerio = require("cheerio");

$("#scrapeBtn").on("click", scrapeArticles = () => {
    console.log("working");
    // $ = cheerio.load(response.data);
    $.get("./scrape").then((data) => {
        $("body").html(data);
    })
});

    // const scrapeArticles = () => {
    //     console.log("working");
    //     $.get("./scrape").then((data) => {
    //         $("body").html(data);
    //     });
    // }; 

    // $("#scrapeBtn").on("click", scrapeArticles);
// })
