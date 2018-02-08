// Copyright Oludare Balogun
// 

/**
* Grab html from rmp and html file is then parsed for an array of names of all professors from Carleton University on the website
*
* @param {string} urlOffset - part of the url. updated each time the function is called to go to the next page.
* @param {string} htmlText - The html content of the webpage.
* @param {{profName: string, ratingsPage: string}} profNameArray - The array storing data on proffs grabbed from html.
* @param {function(string)} callback - Called after populating array with data scraped from html.   
*/
function grabHTMLData(urlOffset, htmlText, profNameArray, callback){
	//Stores DOM elements grabbed from html
	var profListingArray;
  
  // XHR request goes to retrieve html from ratemyprofessor.com. html file is then parsed for an array of names of all professors from Carleton University on the website
  	//alert("Sending request");
    var req = new XMLHttpRequest();
    req.open("GET", "http://www.ratemyprofessors.com/search.jsp?query=&queryoption=HEADER&stateselect=&country=&dept=&queryBy=teacherName&facetSearch=true%2F&schoolName=carleton+university&offset="+urlOffset+"&max=20", true);
    req.onreadystatechange = function() {
      if (req.readyState == 4) {
      	if (req.status == 200) {
         	htmlText = req.responseText; 
         	
         	// Create a dummy HTML object with innerText = responseText. Did it this way because was having problems with responseXML
            var dummy = document.createElement( "html" );
    			dummy.innerHTML = htmlText;
    			profListingArray = $("li.listing.PROFESSOR", dummy); 	
    			
    			//For each listing create an array with each array element being an object that contains a name: string of prof name and a rating
    			for (var i = 0; i < profListingArray.length; i++){
    				var x = $("span.main", profListingArray[i]).text();
    				var y = $("a", profListingArray[i]).attr("href");
    				profNameArray.push({profName: x, ratingsPage: y});
    			}
    			callback(htmlText);	
         }
      }
    };
    req.send();   
}

/**
* Check if htmlText is the last page of results. If not update urlOffset and call grabHTMLdata again, if on last page call findProfOnCurrentPage
* 
* @param{string} htmlText - HTML content of the page
*/
function notOnLastPage(htmlText){

	// Create a dummy HTML object with innerText = responseText. Did it this way because was having problems with responseXML
	var dummy = document.createElement("html");
	dummy.innerHTML = htmlText;
	
	// Find the current page, conveniently kept in the currentStep class
	var currentStep = $("span.currentStep", dummy);
	currentStep = currentStep[0].innerText;
	
	// Find last step by taking the last entry in an array or all step objects
	var lastStep = $("a.step", dummy);
	lastStep = lastStep[lastStep.length - 1].innerText;
	currentStep = parseInt(currentStep);
	lastStep = parseInt(lastStep);
	
	// If we are on the last page
	if (currentStep > lastStep){
    	chrome.storage.local.set({"names" : profNameArray}, function(){
    		findProfOnCurrentPage();
    	});
    	
   // Not on last page so update urlOffset so grabHTMLData can check the next page 	
	} else {
		urlOffset = parseInt(urlOffset) + 20;
		urlOffset = String(urlOffset);
		grabHTMLData(urlOffset, htmlText, profNameArray, notOnLastPage);
	}
}

/**
* Inject content.js into the webpage of the current tab using chrome.tabs api
* 
*/
function findProfOnCurrentPage(){
	chrome.tabs.executeScript({file : "jquery-3.3.1.js"}, function(){ // Inject jquery library as well for good measure
		chrome.tabs.executeScript({file : "content.js"}, function(){
		setTimeout(function(){
			$("body").css("width", "75px");
			$("p").text("Done :)");
			$("div.loader").hide(100); 
		}, 1500 );
		
  		});
  	});
	
}

  var htmlText;
  var profNameArray = [];
  var urlOffset = "0";
  var stop = false;
  
 chrome.storage.local.get("names", function(items){
 	if (typeof items.names === "undefined"){
 		$("p").text("Initial setup may take a few moments");
 		grabHTMLData(urlOffset, htmlText, profNameArray, notOnLastPage);
 	} else {
 		findProfOnCurrentPage();
 	}	 
 });
  

