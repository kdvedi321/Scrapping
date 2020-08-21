let request = require("request");
let fs = require("fs");
let cheerio = require("cheerio");
//console.log("Before");
let count=0;
let leaderBoard=[];
request("https://www.espncricinfo.com/scores/series/19322 ", function(err, res, html){
    if(err===null && res.statusCode===200){
        parseHtml(html);
        //handleMatch(html);
    }else if(res.statusCode===404){
        console.log("Invalid URL");
    }else{
        console.log(err);
        console.log(res.statusCode);
    }
})

function parseHtml(html){
    //parsing series page
    let d=cheerio.load(html);
    let cards=d(".cscore.cscore--final.cricket.cscore--watchNotes");
    //console.log(cards.length);
    //cards=>type=>ODI/T20
    for(let i=0;i<cards.length;i++){
        let matchType=d(cards[i]).find(".cscore_info-overview").html();
        //console.log(matchType);
        let test =matchType.includes("ODI") || matchType.includes("T20");
        if(test===true){
            //console.log(matchType);
            //console.log(matchType);
            //anchors=> href=>manually request
            //cscore_buttonGroup ul li a.html
            let anchor = d(cards[i]).find(".cscore_buttonGroup ul li a").attr("href");
            let matchLink="https://www.espncricinfo.com" + anchor ;
            gotoMatchPage(matchLink);
            //console.log(`https://www.espncricinfo.com${anchor}`)
        }
    }
    console.log("```````````````````````````````");
}

function gotoMatchPage(MatchLink){
    count++;
    request(MatchLink, function(err, res, html){
        if(err==null && res.statusCode==200){
            // console.log(`File${count}saved to disk`);
            // fs.writeFileSync(`match${count}.html`,html);
            handleMatch(html);
            count--;
            if(count==0){
                console.table(leaderBoard);
            }
        }else if(res.statusCode==404){
            console.log("Page Not Found");
        }else{
            console.log(err);
            console.log(res.statusCode);
        }
    })
}

function handleMatch(html){
    const d = cheerio.load(html);
    //batsman,runs,format,teams
    let format = d(".cscore.cscore--final.cricket .cscore_info-overview").html();    
    format=format.includes("ODI")?"ODI":"T20";
    // team
    let teams = d(".sub-module.scorecard h2");
    let innings = d(".sub-module.scorecard");
    //console.log(format);
    for(let i=0;i<innings.length;i++){
        //console.log(d(teams[i]).text());
        let batsManRows = d(innings[i]).find(".scorecard-section.batsmen .flex-row .wrap.batsmen");
        let team=d(teams[i]).text();
        console.log(team);
        for(let br=0;br<batsManRows.length;br++){
            // let batsManInfo = d(batsManRows[br]).text();
            let batsManInfo = d(batsManRows[br]);
            let batsMan = d(batsManRows[br]);
            let batsManName = batsMan.find(".cell.batsmen").text();
            let batsManRun = batsMan.find(".cell.runs").html();
            //console.log(batsManName+" "+batsManRun);
            handlePlayer(format, team, batsManName, batsManRun);
            //batsman name, run, 
            //console.log(batsManInfo);
        }
        console.log("***********************************");
    }    
    console.log("################################");
}
console.log("After");
function handlePlayer(format, team, batsManName, batsManRuns){
    //batsman=>
    batsManRuns = Number(batsManRuns);
    for(let i=0;i<leaderBoard.length;i++){
        let pObj = leaderBoard[i];
        if(pObj.name==batsManName && pObj.format==format && pObj.team==team){
            pObj.runs+=batsManRuns;
            return;
        }
    }
    let obj ={
        runs:batsManRuns,
        format:format,
        team:team,
        name:batsManName
    } 
    //1.First Time=>createnew
    //2. Existing runs increase
}