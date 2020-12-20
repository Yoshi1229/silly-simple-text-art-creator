# Simple blocky text art creator

This is just a Node.js code made for fun.

Dependencies: Jimp

A js file that exports a single function that generates a blocky text art with two inputs: an image file and the desired height of the text art.

Usage:
put textartgen.js in the same folder as your code
```
var TextArtGen = require('./textartgen.js').util.genTextArt;
TextArtGen('./images/smiley.png',16,(err,art)=>{  //The first parameter is the image file path. The second parameter is the desired lines of the text art. In this case, the image will be resized and a 16-line text art will be generated.
  if (err) throw err; //handle any error whatever way you want
  console.log(art);  //the "art" returned is a string, with each line of the text art separated by "\r\n"
});
```
That's about it. Just a simple piece of code.
