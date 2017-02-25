document.addEventListener("DOMContentLoaded", function(event) {
	if(document.getElementById('scrape-articles')){
		getArticles();
	}
	if(document.getElementById('saved-articles')){
		displaySavedArticles();
	}
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

function genSavedArticle(input){
	var container = document.createElement('div');
	var title = document.createElement('p');
	var anchor = document.createElement('a');
	container.className = 'sample-article';
	title.className = 'sample-article-title';
	title.innerText = input.title;
	anchor.className = 'sample-article-anchor';
	anchor.innerText = 'go to article summary';
	anchor.setAttribute('target', '_blank');
	anchor.setAttribute('href', input.link);
	container.appendChild(title);
	container.appendChild(anchor);
	var deleteButton = document.createElement('button');
	deleteButton.setAttribute('articleId',input._id);
	deleteButton.innerText = 'delete article';
	deleteButton.addEventListener('click', deleteArticle, false);
	container.appendChild(deleteButton);
	var addNoteButton = document.createElement('button');
	addNoteButton.innerText = 'add a note';
	addNoteButton.setAttribute('articleId',input._id);
	addNoteButton.addEventListener('click', displayNoteForm, false);
	container.appendChild(addNoteButton);
	return container;
}

function displaySavedArticles(){
	$.get('/findsavedarticles', function(data){
		var savedArticlesContainer = document.getElementById('saved-articles');
		for(var i = 0; i < data.length; i++){
			savedArticlesContainer.appendChild(genSavedArticle(data[i]));
		}
	});
}

function deleteArticle(){
	var id = this.getAttribute('articleId');
	$.post('/deletearticle', {id: id});
	document.getElementById('saved-articles').innerHTML = '';
	displaySavedArticles();
}

function displayNoteForm(){
	var noteInput = document.createElement('div');
	noteInput.className = 'note-input';
	var noteForm = document.createElement('form');
	var noteTextArea = document.createElement('textarea');
	noteTextArea.setAttribute('rows', 3);
	noteTextArea.setAttribute('name','noteContent');
	var submitNoteButton = document.createElement('button');
	submitNoteButton.innerText = 'submit note';
	submitNoteButton.setAttribute('articleId',this.getAttribute('articleId'));
	submitNoteButton.addEventListener('click', submitNote, false);
	noteForm.appendChild(noteTextArea);
	noteForm.appendChild(submitNoteButton);
	noteInput.appendChild(noteForm);
	this.parentNode.appendChild(noteInput);
	this.parentNode.removeChild(this);
}

function submitNote(){
	//remember to add the add note button again
	// var addNoteButton = document.createElement('button');
	// addNoteButton.innerText = 'add a note';
	// addNoteButton.setAttribute('articleId',input._id);
	// addNoteButton.addEventListener('click', displayNoteForm, false);
	// container.appendChild(addNoteButton);

}