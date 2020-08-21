let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
request("https://www.espncricinfo.com/series/19322/commentary/1187683 ", function(err, res, html){
    if(err===null && res.statusCode===200){
        //fs.writeFile("index.html",html,function(){
        //    console.log("Written file to disk");
        //})
        fs.writeFileSync("index.html", html);
    }else if(res.statusCode===404){
        console.log("Invalid URL");
    }else{
        console.log(err);
        console.log(res.statusCode);
    }
})
console.log("After");