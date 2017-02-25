// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
// Bring in our Models: Article and Note
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

//initialize the express server
var app = express();

app.use(bodyParser.urlencoded({extended: false}));

//make the public folder a static directory
app.use(express.static('public'));

//database configuration with mongoose using the mongodb database
//selected database name: homework14
mongoose.connect('mongodb://localhost/homework14');

//save the mongoose connection to db
var db = mongoose.connection;

db.on('error', function(error){
	console.log('mongoose error: ', error);
});

db.once('open', function(){
	console.log('mongoose connection successful.');
});

//===================================================
//routes:
app.get('/', function(request, response){
	response.send(index.html);
});

app.get('/scrape/:headlineNumber', function(req, res){
	var headlinePage = req.params.headlineNumber;
	var url = 'https://www.democracynow.org/headlines';
	if(headlinePage !== 1){
		url += '/' + headlinePage;
	}
	//request the headlines from dn
	request(url, function(error, response, html){
		//load the html body from request into cheerio
		var $ = cheerio.load(html);
		var titlesAndLinks = [];
		//save the title and anchor
		$('div.news_item.with_horizontal_image').each(function(i, element){
			var title = $(this).children('div.content').children('h3').children('a').text();
			var link = $(this).children('div.content').children('h3').children('a').attr('href');
			var together = {
				title: title,
				link: 'https://www.democracynow.org' + link
			};
			titlesAndLinks.push(together);
		});
		res.json(titlesAndLinks);
	});
});

app.post('/savearticle', function(req, res){
	console.log(req.body);
	var newArticle = new Article(req.body);
	// newArticle.save(function(error, doc){
	// 	if(error){
	// 		console.log(error);
	// 	}else{

	// 	}
	// });
});

app.post('/addnote', function(req,res){
	var newNote = new Note(req.body);
	newNote.save(function(error, doc){
		if(error){
			console.log(error);
		}else{
			Article.findOneAndUpdate({},{ $push: { "comments": doc._id } }, { new: true }, function(err, newdoc) {
				// Send any errors to the browser)
				if(err){
					console.log(err);
				}else{
					//add this new note / comment to the database?
				}
			});
		}
	});
});
//===================================================

//listen on port 3000
app.listen(3000, function(){
	console.log('app running on port 3000');
});