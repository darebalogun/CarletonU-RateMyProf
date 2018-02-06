// Retrieve array of names and ratings pages stored on local machine using chrome storage API
chrome.storage.local.get("names", function(items){
	var nameArray = items["names"];
	//This returns all elements with no child nodes with the <td> tag. Carleton uses this tag as prof names are table entries in html
	var allTdElements = $("td:not(:has(*))"); 
	for (var i = 0; i < nameArray.length; i++){
		for (var j = 0; j < allTdElements.length; j++) {
			var RMPfullName = nameArray[i].profName.split(",");
			var RMPlastName = RMPfullName[0].toLowerCase();
			var RMPfirstName = RMPfullName[1].replace(/\s+/g, "").toLowerCase();
			
			var pageFullName = allTdElements[j].innerText.toLowerCase();
			var pageFirstName = pageFullName.split(" ")[0];
						
			//If content of td tag contains a professors last name then investigate further
			if (pageFullName.indexOf(RMPlastName) !== -1){
				//If first name from RMP array data contains first name on Carleton page or vice versa, thats good enough for us insert link to their ratings page
				if (pageFullName.indexOf(RMPfirstName) !== -1 || RMPfirstName.indexOf(pageFirstName) !== -1){
					allTdElements[j].innerHTML = "<a href=http://ratemyprofessor.com/"+ nameArray[i].ratingsPage + ">" + allTdElements[j].innerText +"</a>"; 
					//If first name on RMP is an initial investigate further
				} else if (RMPfirstName.indexOf(".") !== -1) {
					// If first character of initial matches first character of first name thats good enough
					if (RMPfirstName.charAt(0) === pageFullName.charAt(0)){
						allTdElements[j].innerHTML = "<a href=http://ratemyprofessor.com/"+ nameArray[i].ratingsPage + ">" + allTdElements[j].innerText +"</a>";
					// If second initial matches first character or first name thats also good enough	
					} else if (RMPfirstName.charAt(RMPfirstName.indexOf(".") + 1) === pageFullName.charAt(0)){
						allTdElements[j].innerHTML = "<a href=http://ratemyprofessor.com/"+ nameArray[i].ratingsPage + ">" + allTdElements[j].innerText +"</a>";
					}
				}		
			}
		}
	}
});


