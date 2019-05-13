/**
	Authors: Alberto Villareal, Julian Arvizu
	Date: 04/24/19
	Class: CSC 337
	Summary: This is the service.js for the lowes final prject,
	this project is designed to locate, add and remove pallets
	for inventory. This service.js accesses the text files used to get
	the information on the pallets as well as updating it.
*/
(function(){
	console.log("Starting Lowes Webservice");
	/**
	this function opens up the filename and splits it up
	after each comma and stores them into its respective info,
	and after each info it pushes it and starts the next line.
	*/
	function getLowesInfo(filename){
		let info = [];
		try{
			let lines = fs.readFileSync(filename, 'utf8');
			let splitLines = lines.split("\r");
			//console.log(splitLines);
			for (let i = 1; i < splitLines.length; i++){
				if (splitLines[i] != ""){
					let infoLine = splitLines[i].split(",");
					let Info = {};
					let location = infoLine[0];
					let type = infoLine[1];
					let brand = infoLine[2];
					let itemnum = infoLine[3];
					let itemname = infoLine[4];
					let dyelot = infoLine[5];
					let size = infoLine[6];
					Info["location"] = location;
					Info["type"] = type.slice(1);
					Info["brand"] = brand.slice(1);
					Info["itemnum"] = itemnum.slice(1);
					Info["itemname"] = itemname.slice(1);
					Info["dyelot"] = dyelot.slice(1);
					Info["size"] = size.replace("\r","");
					info.push(Info);
				}
			}
		}
		catch(e){
			console.log(e);
		}
		return info;
	}
	/**
	this function access the filenmae with the logins, this
	is splits by ::: and then pushes it and starts the next line
	*/
	function getLoginInfo(filename){
		let info = [];
		try{
			let lines = fs.readFileSync(filename, 'utf8');
			let splitLines = lines.split("\n");

			for (let i = 0; i < splitLines.length; i++){
				let infoLine = splitLines[i].split(":::");
				let Info = {};
				let username = infoLine[0];
				let password = infoLine[1];
				Info["username"] = username;
				Info["password"] = password.replace("\r","");
				info.push(Info);
			}
		}
		catch(e){
			console.log(e);
		}
		return info;
	}
	/**
	function to get pallet info and turns into a string
	*/
	function parsePallete(listOfInfo){
		return listOfInfo[0] + ", " + listOfInfo[1] + ", " + listOfInfo[2] +
		", " + listOfInfo[3] + ", " + listOfInfo[4] + ", " + listOfInfo[5] + 
		", " + listOfInfo[6];
	}
	/**
	suppose to remove pallet from a file
	currently not working.
	*/
	function removeLine(line, file){
		try{
			let data = fs.readFileSync(file, 'utf-8');
			let dataSplit = data.split("\r");
			let counter = 0;
			var ip = line;
			for (let i = 0; i < dataSplit.length; i++){
				let fileLine = "";
				console.log(dataSplit[i]+ " and " + ip);
				//console.log(fileLine + " and " + ip);
				if (fileLine != ip && counter === 0){
					fs.writeFile(file, fileLine + "\r", function (err) {
					  if (err) throw err;
					});
					counter += 1;
				}
				else if (fileLine != ip){
					fs.appendFile(file, fileLine + "\r", function(err){
						if (err){
							console.log(err);
							res.status(400);
						}
					});	 
				}
				if (fileLine === ip){
					console.log("MATCH");
				}
			}
			console.log('Saved!');
		}
		catch(e){
			console.log(e);
		}
	}
	
	const express = require("express");
	const app = express();
	const fs = require("fs");
	const bodyParser = require('body-parser');
	const jsonParser = bodyParser.json();

	app.use(express.static('public'));

	app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", 
				   "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	
	/**
	DOES the POST stuff
	*/
	app.post('/', jsonParser, function (req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		let remove = req.query.remove;
		if (remove === "true"){
			let string = req.body.string;
			removeLine(string, "lowes_info.txt");
		}
		else{
			//Location, Type, Brand, Item #, Item Name, Dyelot, Size
			let location = req.body.location;
			let type = req.body.type;
			let brand = req.body.brand;
			let itemnum = req.body.itemnum;
			let itemname = req.body.itemname;
			let dyelot = req.body.dyelot;
			let size = req.body.size;
			let palleteList = [location,type,brand,itemnum,itemname,dyelot,size];
			fs.appendFile("lowes_info.txt", "\n" + parsePallete(palleteList), function(err){
				if (err){
					console.log(err);
					res.status(400);
				}
				else{
				console.log("The file was updated and saved!");
				res.send("Success");
				}
			});	
		} 
	})
	/**
	Does the GET stuff
	*/
	app.get('/', function (req, res) {
		res.header("Access-Control-Allow-Origin", "*");
		//Find a way to get userdata for login
		let remove = req.query.remove;
		
		//Gets the data regarding inventory and sends it
		let filename1 = "lowes_info.txt";
		let info = {};
		let data = getLowesInfo(filename1);
		info["info"] = data;
		
		let filename2 = "user_info.txt";
		let logininfo = getLoginInfo(filename2)
		info["login"] = logininfo;
		
		res.send(JSON.stringify(info));
	})
	//Setting the server number to 3000, "http://localhost:3000"
	app.listen(3000);
	
})();