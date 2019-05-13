/*
	Authors: Alberto Villareal, Julian Arvizu
	Date: 04/24/19
	Class: CSC 337
	Summary: This is the js for the lowes final prject,
	this project is designed to locate, add and remove pallets
	for inventory. This js uses the info provided by the service js
	such as the textfile used to store the info and as well as
	the username and passwords available
*/
(function(){
	/**
	This is the onload, the program will prompt the user
	to enter his username and password, then will hit submit.
	*/
	window.onload = function(){
		let submit = document.getElementById("submitlogin");
		submit.onclick = checkUser;
	}
	/**
	DONE
	Checks if the user is correct and can enter the website proper, if not should
	alert the user that they cannot enter due to wrong info
	*/
	function checkUser(){
		let username = document.getElementById("username").value;
		let password = document.getElementById("password").value;
		getUsers(username, password);

	}
	/**
	DONE
	Gets all the user info from the user_info.txt from the lowes_service.js and
	checks if the current username and password matches any of the pairs of info
	*/
	function getUsers(username, password){
		url = "http://localhost:3000"
		  fetch(url)
         .then(checkStatus)
         .then(function(responseText){
            let json = JSON.parse(responseText);
            let info = json["login"];
			for (let i = 0; i < info.length; i++){
				if (username === info[i]["username"] && password === info[i]["password"]){
					changeToMain();
				}
			}
            
         })
         .catch(function(error){
            console.log(error);
         });
	}
	/**
	DONE
	Removes all html stuff regarding login information
	*/
	function removeLogin(){
		item = document.getElementById("lowespic");
		document.body.removeChild(item);
		
	}
	/**
	DONE
	Adds info regarding the inventory onto the page using js, only applies a 
	search bar, and search button.  
	*/
	function addInfo(){
		let body = document.body;
		//Creates the options via radio buttons
		let radios = document.createElement("FORMS");	
		radios.setAttribute("id", "optionsForm");
		let optionsDiv = document.createElement("div");
		optionsDiv.setAttribute("id", "options");
		body.appendChild(optionsDiv);
		optionsDiv.appendChild(radios);
		createRadio("Search", "options", radios);
		createRadio("Add", "options", radios);
		createRadio("Remove", "options", radios);
		radios.onchange = changeOptions;
		//Creates the searchbar and searchbutton
		let searchBar = document.createElement("input");
		searchBar.setAttribute("id", "search");
		searchBar.value = "";
		let submit = document.createElement("input");
		submit.type = "button";
		submit.value = "Search";
		submit.onclick = getInventory;
		//Creates the visual representation of the aisle inventory
		let aisles = createAisles();
		//Creates the div that holds all options
		let pallet = document.getElementById("palletstuff");
		pallet.appendChild(optionsDiv);
		setSearch();
		pallet.appendChild(searchBar);
		pallet.appendChild(submit);
		let bigDiv = document.createElement("div");
		bigDiv.setAttribute("id", "bigDiv");
		//pallet.appendChild(aisles);
		bigDiv.appendChild(pallet);
		bigDiv.appendChild(aisles);
		document.body.appendChild(bigDiv);
	}
	/**
	DONE
	Creates a radio input given some text for the label, name that all the
	radios should share, and the form that contains all the radios.
	*/
	function createRadio(text, name, Form){
		//<label><input type="radio" checked="checked" name="wordsize" value="36" />Medium</label>
		let radio = document.createElement("INPUT");
		radio.setAttribute("type", "radio");
		radio.setAttribute("id", "radio"+text);
		radio.setAttribute("name", name);	
		radio.setAttribute("value", text);
		let label = document.createElement("LABEL");
		let radioText = document.createTextNode(text);
		label.setAttribute("for", "radio"+text);
		label.appendChild(radioText);
		if (Form.children.length === 0){
			radio.setAttribute("checked", "checked"); 
		}
		Form.appendChild(radio);
		Form.insertBefore(label, radio);
		}
	/**
	DONE
	When the option is changed from search, add, or remove it will call a 
	function that applies the affects to the page to do its task.
	*/
	function changeOptions(){
		let options = document.getElementById("optionsForm");
		for (let i = 0; i < options.children.length; i++){
			if (options.children[i].checked){
				if (options.children[i].value === "Search"){
					setSearch();
				}
				if (options.children[i].value === "Add"){
					setAdd();
				}
				if (options.children[i].value === "Remove"){
					removeStuff();
				}
         }
      }
	}
	/**
	DONE
	When called it will add a new form of radios for filtering the search,
	on default it will search for itemnum, but can be filtered on brand or type
	*/
	function setSearch(){
		removeStuff();
		let filters = document.createElement("FORMS");	
		filters.setAttribute("id", "filtersForm");
		//optionsDiv.setAttribute("id", "options");
		createRadio("Item number", "filters", filters);
		createRadio("Brand", "filters", filters);
		createRadio("Type", "filters", filters);
		
		let filterDiv = document.createElement("div");
		filterDiv.setAttribute("id", "filters");
		filterDiv.appendChild(filters);
		let search = document.getElementById("search");
		let pallet = document.getElementById("palletstuff");
		pallet.insertBefore(filterDiv, search);
	}
	/**
	DONE
	Checks to see if there is space to add if not it prompts that it is full, 
	otherwise it will provide inputs to put info info about new pallete.
	*/
	function setAdd(){
		//ADD THIS BACK IN LOWES_INFO.txt
		//40R:8, Tile, Ceramic, 868169, Acadia Brown, A5, 180 
		removeStuff();
		url = "http://localhost:3000"
		  fetch(url)
         .then(checkStatus)
         .then(function(responseText){
			let aisles = document.getElementsByClassName("aisle-row");
            let json = JSON.parse(responseText);
            let info = json["info"];
			if (info.length === 64){
				let addDiv = document.createElement("div");
				addDiv.setAttribute("id", "addDiv");
				addDiv.innerHTML = "CANNOT ADD ANY MORE PALLETES";
				let pallet = document.getElementById("palletstuff");
				pallet.prepend(addDiv);
			}
         })
         .catch(function(error){
            console.log(error);
         });
		//If addDiv does not exist then add it.
		if (document.getElementById("addDiv") == null){
			//Creates a div to store all components made in this function
			//Stores the parameters for pallets in an array to use for loop
			let addDiv = document.createElement("div");
			addDiv.setAttribute("id", "addDiv");
			let infoList = ["Location: ", "Type: ", "Brand: ", "Item #: ",
			"Item Name: ", "Dyelot: ", "Size: "];
			for (let i = 0; i < infoList.length; i++){
				//Creates the inputs for all the parameters
				let textNode = document.createTextNode(infoList[i]);
				let input = document.createElement("input");
				input.setAttribute("id", infoList[i].slice(0,-2));
				let label = document.createElement("label");
				label.appendChild(textNode);
				addDiv.appendChild(input);
				addDiv.insertBefore(label, input);
			}
			//Creates a submit button and then adds the div before the aisles div
			let addSubmit = document.createElement("input");
			addSubmit.type = "button";
			addSubmit.value = "Add to Aisles";
			addSubmit.onclick = addNewPallete;
			addDiv.appendChild(addSubmit);
			let pallet = document.getElementById("palletstuff");
			pallet.appendChild(addDiv);
			}
	}
	/**
	DONE
	this function will ask the user for the proper information
	in order to add a new pallet in the .txt file where ever there
	is an empty spot for it
	*/
	function addNewPallete(){
		let location = document.getElementById("Location").value;
		let type = document.getElementById("Type").value;
		let brand = document.getElementById("Brand").value;
		let itemnum = document.getElementById("Item #").value;
		let itemname = document.getElementById("Item Name").value;
		let dyelot = document.getElementById("Dyelot").value;
		let size = document.getElementById("Size").value;
		const pallete = {location: location, type: type, brand: brand, 
		itemnum: itemnum, itemname:itemname, dyelot:dyelot, size: size};
		const fetchOptions = {
         method : 'POST',
         headers : {
            'Accept': 'application/json',
            'Content-Type' : 'application/json'
         },
         body : JSON.stringify(pallete)
      }	;

		  let url = "http://localhost:3000";
		  fetch(url, fetchOptions)
			 .then(checkStatus)
			 .then(function(responseText) {
				console.log(responseText);
			 })
			 .catch(function(error) {
				console.log(error);
			 });
	}
	/**
	DONE
	Applies the changes to entering the website proper
	function that transition the user from the login page
	to the actual webpage that the user intended on accessing
	*/
	function changeToMain(){
		removeLogin();
		addInfo();
		updateAisles();
	}
	/**
	DONE
	function that asks the user to enter and item number and searchs
	for it and displays it for the user as well as highlighting the location
	*/
	function getInventory(){
		let filter = document.getElementById("filtersForm");
		let id = "itemnum";
		for (let i = 0; i < filter.children.length; i++){
			if (filter.children[i].checked){
				if (filter.children[i].value === "Item number"){
					id = "itemnum"
				}
				if (filter.children[i].value === "Brand"){
					id = "brand";
				}
				if (filter.children[i].value === "Type"){
					id = "type";
				}
         }
		}	
		
		let itemnum = document.getElementById("search").value;
		updateAisles();
		//This removes previous printed palletes and other spacings
		let datadiv = document.getElementById("lowesinfo");
		datadiv.childNodes.forEach(function(thing){
         thing.remove();
      });
		let ps = document.querySelectorAll("#lowesinfo p");
		ps.forEach(function(p){
         p.remove();
      });
		//Gets the pallete from the itemnum in the searchbar and prints
		//it at the top of the page
		if (itemnum != ""){
			url = "http://localhost:3000"
			  fetch(url)
			 .then(checkStatus)
			 .then(function(responseText){
				let aisles = document.getElementsByClassName("aisle-row");
				let json = JSON.parse(responseText);
				let info = json["info"];
				for (let i = 0; i < info.length; i++){
					if (itemnum === info[i][id]){
						//Location, Type, Brand, Item #, Item Name, Dyelot, Size
						let locsplit = info[i]["location"].split(":");
						let aisleloc = locsplit[0]
						let baynum = parseInt(locsplit[1]);
						let data = document.createTextNode(parseInfo(info[i]));
						let linebreak = document.createElement("p");
						linebreak.innerHTML = "<br />";
						let datadiv = document.getElementById("lowesinfo");
						let grid = aisles[getColumn(aisleloc)].children[baynum];
						if (grid.classList.contains("RED")){
							grid.classList.remove("RED");
						}
						grid.classList.add("YELLOW");
						datadiv.appendChild(data);
						datadiv.appendChild(linebreak);
					}
				}
				//console.log(info);
				
			 })
			 .catch(function(error){
				console.log(error);
			 });
		}
		
		//updateAisles();
	}
	/**
	DONE
	this function creats the asiles that displays to the user
	on what is available and what is not as well as labeling
	the asile number and its respective left or right side.
	*/
	function createAisles(){
		let gridContainer = document.createElement("div");
		gridContainer.classList.add("aisles");
		let counter = 0;
		let rows = 36;
		let left = true;
		while (counter < 13){
			let row = document.createElement("div");
			row.classList.add("aisle-row");
			for (let i = 0; i < 9; i++){
				let grid = document.createElement("div");
				grid.classList.add("aisle-item");
				
				if (i != 0){
					if (counter % 3 == 0){
						grid.classList.add("black");
					}
					else{
						grid.innerHTML = "";
						grid.onclick = removeItem;
					}
				}
				else{
					if (counter % 3 == 0){
						grid.innerHTML = rows.toString();
						rows += 1;
					}
					else if(left){
						grid.innerHTML = "L";
						left = !left;
					}
					else{
						grid.innerHTML = "R";
						left = !left;
					}
				}
				row.appendChild(grid);
			}
			gridContainer.appendChild(row)
			counter +=1;
		}
		return gridContainer;
	}
	/**
	DONE
	Removes the divs that are made that have stuff for filtering and the 
	add parameters for palletes.
	*/
	function removeStuff(){
		let addStuffs = document.querySelectorAll("#addDiv")
		let searchStuff = document.getElementById("filters");
		if (addStuffs != null){
			addStuffs.forEach(function(div){
				div.remove();
			});
			
		}
		if (searchStuff != null){
			searchStuff.remove();
		}
	}
	/**
	NOT DONE
	Removes the pallete item when clicked on, warns the user to prevent
	accidental removal.
	*/
	function removeItem(event){
		removeStuff();
		let radioRemove = document.getElementById("radioRemove").checked;
		if (radioRemove){
			if (confirm("ARE YOU SURE YOU WANT TO REMOVE THIS PALLETE!")) {
				//Location, Type, Brand, Item #, Item Name, Dyelot, Size
				let aislelocation = 0;
				let baynumber = 0;
				//This gets me the values to compare the location
				let aisles = document.getElementsByClassName("aisle-row");
				for (let i = 0; i < aisles.length; i++){
					let col = Array.from(aisles[i].children)
					if (aisles[i].contains(this)){
						aislelocation = i;
						baynumber = col.indexOf(this);
						console.log("i: " + i.toString() + " col: " + 
						(col.indexOf(this) + 0).toString() );
						console.log("\tfound");
					}	
				}
				
				//Next we have to go through all the data and match 
				//aisleloc === aislelocation and baynum === baynumber
				url = "http://localhost:3000?remove=true" 
				  fetch(url)
				 .then(checkStatus)
				 .then(function(responseText){
					let aisles = document.getElementsByClassName("aisle-row");
					let json = JSON.parse(responseText);
					let info = json["info"];
					for (let i = 0; i < info.length; i++){
						//Location, Type, Brand, Item #, Item Name, Dyelot, Size
						let locsplit = info[i]["location"].split(":");
						let aisleloc = locsplit[0]
						let baynum = parseInt(locsplit[1]);
						if (baynum === baynumber && getColumn(aisleloc) === aislelocation){
							console.log(parseInfo(info[i]));
							let result1 = info[i]["location"] + ", " + 
							info[i]["type"] + ", " + info[i]["brand"] + ", " +
							info[i]["itemnum"] + ", " + info[i]["itemname"] + 
							", " + info[i]["dyelot"] + "," + info[i]["size"];
							console.log(result1);
							
							//Post info
							const pallete = {string: result1};
								const fetchOptions = {
								 method : 'POST',
								 headers : {
									'Accept': 'application/json',
									'Content-Type' : 'application/json'
								 },
								 body : JSON.stringify(pallete)
							  }	;

								  let url = "http://localhost:3000?remove=true";
								  fetch(url, fetchOptions)
									 .then(checkStatus)
									 .then(function(responseText) {
										console.log(responseText);
									 })
									 .catch(function(error) {
										console.log(error);
									 });
						}
					}
				 })
				 .catch(function(error){
					console.log(error);
				 });
			}
			//Otherwise do nothing
			else {
				console.log("It stays");
			}
		}
	}
	/**
	DONE
	function that updates visually on the staus of the aisles
	such as highlighting red when occupied, yellow when user
	is looking for it, blank if open spot, as well as display information
	when user hovers over a filled spot.
	*/
	function updateAisles(){
		url = "http://localhost:3000"
		  fetch(url)
         .then(checkStatus)
         .then(function(responseText){
			//Obtains aisles, the rows, info about palletes using a fetch
			let aisles = document.getElementsByClassName("aisle-row");
            let json = JSON.parse(responseText);
            let info = json["info"];
			//Go through all palletes and assign to grid
			for (let i = 0; i < info.length; i++){
				//Gets location data to get specific grid item
				let locsplit = info[i]["location"].split(":");
				let aisleloc = locsplit[0]
				let baynum = parseInt(locsplit[1]);
				let abbr = document.createElement("ABBR");
				abbr.setAttribute("title", parseInfo(info[i]));
				let star = document.createTextNode("X");
				let grid = aisles[getColumn(aisleloc)].children[baynum]
				//Checks to see if pallete is yellow, if so makes it red again
				if (grid.classList.contains("YELLOW")){
					grid.classList.remove("YELLOW");
				}
				grid.classList.add("RED");
				//Should only apply once, need to fix this
				if (grid.children.length < 1){
					abbr.appendChild(star);
					grid.appendChild(abbr);
				}
				
			}          
         })
         .catch(function(error){
            console.log(error);
         });
	}
	/**
	DONE
	function that gets the location of the pallet
	by its respective aisle number and its bay number
	as well if its left or right of the aisle.
	*/
	function getColumn(aisle){
		let num = (parseInt(aisle) - 36) * 3;
		let pos = aisle.slice(2);
		if (pos === "L"){
			num += 1;
		}
		else if(pos === "R"){
			num -= 1;
		}
		return num;
	}
	/**
	DONE
	prints out information of the pallet
	*/
	function parseInfo(info){
		result = "";
		result += "Name:\t\t" +  info["itemname"] + "\n";
		result += "#" + info["itemnum"] + "\tLocation: " + info["location"] + "\tType: " + info["type"] + "\n";
		result += "Size: " + info["size"]+ "\tDyelot: " + info["dyelot"];
		return result;
	}
	/**
	DONE
	make sure that fetch or posting returns
	the proper server response.
	*/
	function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response.text();
    } else if (response.status === 404) {
      return Promise.reject(new Error("Sorry, we couldn't find that page"));
    } else {
        return Promise.reject(new Error(response.status+": "+response.statusText));
    }
}
	
})();
