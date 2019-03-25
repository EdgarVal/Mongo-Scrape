$("#scrapeBtn").on("click", scrapeArticles = () => {
    // console.log("working");
    $.get("/scrape").then((data) => {
        $("body").html(data);
    })
});


$("#saveArt").on("click", saveArticle = () => {
    // console.log('clicked');
    let id = $(this).data("id");
    $.ajax({
        url: "/article/${id}",
        method: "PUT"
    }).then((data) => {
        location.reload();
    });
});

