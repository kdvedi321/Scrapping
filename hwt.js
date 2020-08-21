let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
console.log("Sending Request");
request("https://www.espncricinfo.com/series/19322/scorecard/1187683 ", function(err, res, html){
    if(err===null && res.statusCode===200){
        //fs.writeFile("index.html",html,function(){
        //    console.log("Written file to disk");
        //})
        console.log("Received Data");
        fs.writeFileSync("scorecard.html", html);
        parseHtml(html);
    }else if(res.statusCode===404){
        console.log("Invalid URL");
    }else{
        console.log(err);
        console.log(res.statusCode);
    }
})

function parseHtml(html){
    console.log("***parsing Html***");
    let d=cheerio.load(html);
    //let bowlingScoreCard=d(".scorecard-section.bowling");
    let bowlers = d(".scorecard-section.bowling table tbody tr");
    /*for(let i=0;i<bowlingScoreCard.length;i++){
        let trArr1=d(bowlingScoreCard[i]).find("table tbody tr");
        console.log(`Bowlers of Team ${i+1}`);
        for(let j=0;j<trArr1.length;j++){
            console.log(d(trArr1[j]).text());
        }
    }*/
    let maxi=0, name="";
    for(let i=0;i<bowlers.length;i++){
        let bowlerName=d(d(bowlers[i]).find("td")[0]).text();
        let wickets=d(d(bowlers[i]).find("td")[5]).text();
        if(wickets>maxi){
            maxi=wickets;
            name=bowlerName;
        }
        //console.log(bowlerName+" "+wickets);
    }
    console.log(name+" "+maxi);    
    //fs.writeFileSync("bowling.html", bowlingScoreCard);
    //let team1Bowlers = bowlingScoreCard[0];
    //let team2Bowlers = bowlingScoreCard[1];
}
console.log("After");