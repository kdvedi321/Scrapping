let fs=require("fs");
console.log("Before");
//work start
fs.readFile("f1.html",function(err, content){
    // later
    console.log(content+"");
});
//move on
console.log("After ");