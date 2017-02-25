var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Create an ArticleSchema with the Schema class
var ArticleSchema = new Schema({
  // title: a unique String
  title: {
    type: String,
    unique: true
  },
  link:{
    type: String,
  },
  createdDate:{
    type: Date,
    default: Date.now
  },
  // notes property for the article
  comments: [{
    // Store ObjectIds in the array
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the Note model
    ref: "Note"
  }]
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;