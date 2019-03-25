let mongoose = require("mongoose");
let Schema = mongoose.Schema;

let ArticleSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    summary: {
        type: String,
        required: false
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    timestamp:{
        type: Date,
        default: Date.now
    },
    saved: {
        type: Boolean,
        default: false
    },
    note: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

let Article = mongoose.model("Article", ArticleSchema);
module.exports = Article;