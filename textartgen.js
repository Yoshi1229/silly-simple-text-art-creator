//Text art engine.
const Jimp = require('jimp');
function genTextArt(path,height,cb){
	var colorData=[];
	Jimp.read(path).then(imageTest=> {
	imageTest.resize(Jimp.AUTO, height);
    imageTest.scan(0, 0, imageTest.bitmap.width, imageTest.bitmap.height, function (x, y, idx) {
        var red   = this.bitmap.data[ idx + 0 ];
        var green = this.bitmap.data[ idx + 1 ];
        var blue  = this.bitmap.data[ idx + 2 ];
        var alpha = this.bitmap.data[ idx + 3 ];
	    var colorWeight = (256-(red/255*76)-(green/255*150)-(blue/255*29))*(alpha/255); //256=solid black; 0=pure white or total transparency. i might as well just grayscale the image then do it in a simpler way, but this isnt bad
	    colorData.push({x:x,y:y,r:red,g:green,b:blue,a:alpha,cw:colorWeight}); //return this if you want to
    });
	var knownWeights=[];
	for(var c=0;c<colorData.length;c++){
		if(knownWeights.indexOf(colorData[c].cw)===-1){knownWeights.push(colorData[c].cw);}
	}
	knownWeights.sort(function(a, b){return a - b}); //ascending order
  	var finalArt='',currRow=0;
	if(knownWeights.length>5){
		for(var b=1;knownWeights.length>5;b++){
		  for(var a=0;a<knownWeights.length-1;a++){
		  	if(Math.abs(knownWeights[a+1]-knownWeights[a])<=b){knownWeights[a]=knownWeights[a+1];} //chooses the larger number (all values will be the upper class boundaries) a bit biased to the lighter colors though
		  }
		  knownWeights=[...new Set(knownWeights)]; //kill off repeated values
		}	
	} 
	var palette=['──','░░','▒▒','▓▓','██','██']; //the sixth one is for the special cases met in the switch case block below.
	switch (knownWeights.length){ //affects contrast, but im too lazy to make this configurable :p
		case 5: palette=['──','░░','▒▒','▓▓','██']; break;
		case 4: palette=['──','░░','▒▒','██']; break;
		case 3: palette=['──','░░','██']; break;
		case 2: var p=palette.slice(0);palette[0]=p[Math.floor(knownWeights[0]/256*5)];palette[1]=p[Math.floor(knownWeights[1]/256*5)];palette=palette.slice(0,2);break;
		case 1: var p=palette.slice(0);palette=[];palette.push(p[Math.floor(knownWeights[0]/256*5)]);break;
		default: cb(new Error('An error occured during image parsing')); return;
	}
	colorData.forEach((o)=>{
		if(o.y!==currRow){currRow=o.y;finalArt+='\r\n';}
		for(var i=0;i<knownWeights.length;i++){
			if(o.cw<=knownWeights[i]){
				finalArt+=palette[i];
				break;
			}
		}
	});
	
	 cb(null,finalArt);
    }).catch(err=>{cb(err);});
}

module.exports={util:{genTextArt}}
