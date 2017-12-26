var Jimp = require("jimp");
var path = './example.png'; //change this to whatever you want (path of the image)
 var colorData=[];
// open a file called "lenna.png" 
Jimp.read(path, function (err, asriel) {
    if (err) throw err;
	
    asriel.scan(0, 0, asriel.bitmap.width, asriel.bitmap.height, function (x, y, idx) {
    // x, y is the position of this pixel on the image 
    // idx is the position start position of this rgba tuple in the bitmap Buffer 
    // this is the image 
 
    var red   = this.bitmap.data[ idx + 0 ];
    var green = this.bitmap.data[ idx + 1 ];
    var blue  = this.bitmap.data[ idx + 2 ];
    var alpha = this.bitmap.data[ idx + 3 ];
	var colorWeightNoAlpha = -(red/255*76)-(green/255*150)-(blue/255*29)+256;
	var colorWeight=colorWeightNoAlpha*(alpha/255);
	console.log(red);
	console.log(green);
	console.log(blue);
	console.log(alpha);
	console.log(colorWeight);
	colorData.push({x:x,y:y,r:red,g:green,b:blue,a:alpha,cw:colorWeight});
 
    // rgba values run from 0 - 255 
    // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel 
});
console.log(colorData);
checkWeight();
});
function checkWeight(){
	var minWeight=0,maxWeight=0,depthCount=0,knownWeights=[],type=0;
	for(var c=0;c<colorData.length;c++){
		if(colorData[c].cw>maxWeight){maxWeight=colorData[c].cw}
		if(colorData[c].cw<minWeight){minWeight=colorData[c].cw}
		if(knownWeights.indexOf(colorData[c].cw)===-1){knownWeights.push(colorData[c].cw);depthCount++;}
	}
	if(depthCount<=5){type=1;}
	knownWeights.sort(function(a, b){return a - b});
	generateTextArt(type,minWeight,maxWeight,knownWeights,(artttt)=>{console.log(artttt);});
}
function generateTextArt(mode,min,max,arr,cbf){
	console.log(mode+' '+min+' '+max+' '+arr.join('|'));
	var finalArt=[];
	var currRow=0;
	var currRowData=[];
	if(mode===0){
		var arr2=arr.slice(0);
		var toBeDel=[];
		for(var b=0;arr2.length>5;b++){
		for(var a=0;a<arr2.length-1;a++){
			if(Math.abs(arr2[a+1]-arr2[a])<=b){toBeDel.push(a+1); arr2[a]=arr2[a+1];} //i know i can improve this but i dont care anymore
		}
		for(var c=0;c<toBeDel.length;c++){
			arr2.splice(toBeDel[c],1);
		}
		}
		generateTextArt(2,min,max,arr2,(artttt)=>{console.log(artttt);});
		/*
		var mixman=min+max;
		var classBoundaries=[mixman*0.2, mixman*0.4, mixman*0.6, mixman*0.8];

		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('──')}
			else if(colorData[cw].cw<classBoundaries[1]){currRowData.push('░░')}
			else if(colorData[cw].cw<classBoundaries[2]){currRowData.push('▒▒')}
			else if(colorData[cw].cw<classBoundaries[3]){currRowData.push('▓▓')}
			else if(colorData[cw].cw<max){currRowData.push('██')}
		}
		not efficient
		not good for images with colors overall lighter/darker
		the problem using medians instead of averages
		*/
	} else if(mode===1){
		for(var cw=0;cw<colorData.length;cw++){
			if(arr.length===5){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw===arr[0]){currRowData.push('──')}
			else if(colorData[cw].cw===arr[1]){currRowData.push('░░')}
			else if(colorData[cw].cw===arr[2]){currRowData.push('▒▒')}
			else if(colorData[cw].cw===arr[3]){currRowData.push('▓▓')}
			else if(colorData[cw].cw===arr[4]){currRowData.push('██')}
			} else if(arr.length===4){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw===arr[0]){currRowData.push('──')}
			else if(colorData[cw].cw===arr[1]){currRowData.push('░░')}
			else if(colorData[cw].cw===arr[2]){currRowData.push('▒▒')}
			else if(colorData[cw].cw===arr[3]){currRowData.push('██')}
			} else if(arr.length===3){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw===arr[0]){currRowData.push('──')}
			else if(colorData[cw].cw===arr[1]){currRowData.push('░░')}
			else if(colorData[cw].cw===arr[2]){currRowData.push('██')}
			} else if(arr.length===2){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw===arr[0]){currRowData.push('░░')}
			else if(colorData[cw].cw===arr[1]){currRowData.push('██')}
			} else if(arr.length===1){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw===arr[0]){currRowData.push('░░')}}
		}
	} else {
		
		var classBoundaries=arr.slice(0);
        if(arr.length===5){
		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('──')}
			else if(colorData[cw].cw<classBoundaries[1]){currRowData.push('░░')}
			else if(colorData[cw].cw<classBoundaries[2]){currRowData.push('▒▒')}
			else if(colorData[cw].cw<classBoundaries[3]){currRowData.push('▓▓')}
			else if(colorData[cw].cw<=max){currRowData.push('██')}
		}
		} else if(arr.length===4){
		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('──')}
			else if(colorData[cw].cw<classBoundaries[1]){currRowData.push('░░')}
			else if(colorData[cw].cw<classBoundaries[2]){currRowData.push('▒▒')}
			else if(colorData[cw].cw<=max){currRowData.push('██')}
		}
		} else if(arr.length===3){
		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('──')}
			else if(colorData[cw].cw<classBoundaries[1]){currRowData.push('░░')}
			else if(colorData[cw].cw<=max){currRowData.push('██')}
		} } else if(arr.length===2){
		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('░░')}
			else if(colorData[cw].cw<=max){currRowData.push('██')}
		} } else if(arr.length===1){
		for(var cw=0;cw<colorData.length;cw++){
			if(colorData[cw].y!==currRow){currRow=colorData[cw].y;finalArt.push(currRowData.join(''));currRowData=[];}
			if(colorData[cw].cw<classBoundaries[0]){currRowData.push('░░')}
		} }
	} //i know these are dumb, but, im just trying to get it work.
	finalArt.push(currRowData.join(''));currRowData=[];
	if(typeof cbf=='function'){
	cbf(finalArt.join('\n'));
	}
}