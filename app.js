var fs = require("fs");
var lineReader = require("readline");
var files = ['./CSVDATA/India2011.csv','./CSVDATA/IndiaSC2011.csv','./CSVDATA/IndiaST2011.csv'];

var myarray = [];
var ageWiseArray = [];
var stateGenderWiseArray = [];
var educationArray = [];

function readCSVFile(files){
	files.forEach(function(file) {
		fs.readFileSync(file).toString().split("\n").forEach(function(line, index){
			var row = line.split(',');
			myarray.push(line);
		})
	})
	changeArrayToJSON(myarray);
}

function changeArrayToJSON(myarray) {
	var jsonKeys = myarray[0].split(',');
	var rowArray = [];
	for(var i=1;i<myarray.length;i++){
		var rowObj = {};
		var jsonValues = myarray[i].split(',');
		for(var value=0;value<jsonValues.length;value++){
			rowObj[jsonKeys[value]] = jsonValues[value];
		}
		rowArray.push(rowObj);
	}

	filterAgeWiseLiteratePerson(rowArray);

	filterGenderWiseLiteratePerson(rowArray);

	filterEducationCategoryWise(rowArray);
}

function filterEducationCategoryWise(array){
	array.forEach(function(value, index) {
		for(var prop in value) {
			if(value.hasOwnProperty(prop)) {
				if(prop.indexOf("Educational level") !== -1 && prop.lastIndexOf("Persons") !== -1){
					var educationObj = {};
					educationObj.educationLevel = prop;
					educationObj.totalNumber = value[prop];
					educationArray.push(educationObj);
				}
			}
		}
	});
	addValueForCommonKeys(educationArray, 'educationLevel', 'educationCategoryData.json')
}

function filterGenderWiseLiteratePerson(array){
	array.forEach(function(value, index) {
		for(var prop in value) {
			if(value.hasOwnProperty(prop)) {
				if(prop == "Area Name"){
					var stateObject = {};
					stateObject.state = value["Area Name"];
					stateObject.graduateMale = parseInt(value["Educational level - Graduate & above - Males"]);
					stateObject.graduateFemale = parseInt(value["Educational level - Graduate & above - Females"]);
					stateGenderWiseArray.push(stateObject);
				}
			}
		}
	});
	addValueForCommonKeys(stateGenderWiseArray, 'state', 'genderStateWise.json')
}

function filterAgeWiseLiteratePerson(array){
	array.forEach(function(value, index) {
		for(var prop in value) {
			if(value.hasOwnProperty(prop)) {
				if(prop == "Total/ Rural/ Urban"){
					if(value[prop] == "Total"){
						var ageObject = {};
						ageObject.ageGroup = value["Age-group"];
						ageObject.totalLiterate = value["Literate - Persons"];
						ageWiseArray.push(ageObject);
					}
				}
			}
		}
	});
	addValueForCommonKeys(ageWiseArray, 'ageGroup', 'ageWiseData.json')
}

function addValueForCommonKeys(array, commonObject, outputFileName){
	var tempObj = {};
	var uniqueKeyArray = [];
	for(var arrayItem in array){
		var obj1 = array[arrayItem];
		var obj2 = tempObj[obj1[commonObject]];

		if(!obj2){
			uniqueKeyArray.push(obj2 = tempObj[obj1[commonObject]] = {});
		}
		for(var k in obj1)
		obj2[k] = k === commonObject ? obj1[commonObject] : parseInt(obj2[k]||0)+parseInt(obj1[k]);
	}
	//console.log(JSON.stringify(array));
	//console.log(JSON.stringify(uniqueKeyArray));
	//console.log(JSON.stringify(commonObject));
	fs.writeFile('JSONData/'+outputFileName, JSON.stringify(uniqueKeyArray));
}


readCSVFile(files);
