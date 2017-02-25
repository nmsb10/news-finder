document.addEventListener("DOMContentLoaded", function(event) {
	getArticles();
});

var headlinesPage = 1;
var articlesFound = 0;

function getArticles(){
	document.getElementById('scrape-articles').addEventListener('click', function(event){
		event.preventDefault();
		$.get('/scrape/'+ headlinesPage, function(data){
			var headlines = data;
			var articlesContainer = document.getElementById('new-articles');
			for(var i = 0; i < headlines.length; i++){
				articlesContainer.appendChild(genOneArticle(headlines[i]));
			}
		});
		headlinesPage ++;
	});
}

function genOneArticle(input){
	articlesFound ++;
	var container = document.createElement('div');
	var title = document.createElement('p');
	var anchor = document.createElement('a');
	container.className = 'sample-article';
	title.className = 'sample-article-title';
	title.innerText = articlesFound + '. ' + input.title;
	anchor.className = 'sample-article-anchor';
	anchor.innerText = 'go to article summary';
	anchor.setAttribute('target', '_blank');
	anchor.setAttribute('href', input.link);
	container.appendChild(title);
	container.appendChild(anchor);
	var saveButton = document.createElement('button');
	saveButton.setAttribute('articleTitle',input.title);
	saveButton.setAttribute('alink',input.link);
	saveButton.innerText = 'save article';
	saveButton.className = 'save-specific-article';
	saveButton.addEventListener('click', saveArticle, false);
	container.appendChild(saveButton);
	// var contentsArray = [];
	// contentsArray.push(title, anchor);
	// console.log('contentsArray: ', contentsArray);
	// var everything = document.createDocumentFragment();
	// for(var i = 0; i<contentsArray.length; i++){
	// 	everything.appendChild(contentsArray[i]);
	// }	
	// container.appendChild(everything);
	// console.log('everything:', everything);
	return container;
}

function saveArticle(){
	var title = this.getAttribute('articleTitle');
	var link = this.getAttribute('alink');
	$.post('/savearticle', {title: title, link:link});
	var savedNotice = document.createElement('p');
	savedNotice.innerText = 'article saved!';
	savedNotice.className = 'notice-a';
	this.parentNode.appendChild(savedNotice);
	this.parentNode.removeChild(this);
}