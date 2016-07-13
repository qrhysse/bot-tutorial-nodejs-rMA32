// jsonInteract.js

function spaceCalc(sbheader, header, obj) {
    var num = sbheader.length - (String(obj).length + header.length);
    return Array(num+1).join(" ");
  }

function getScoreboard(lols, darns) {
    console.log('getScoreboard called');
    var scoreboardHead = "-------------SCOREBOARD-------------";
    var totalLols = "TOTAL LOLS:";
    var totalDarns = "TOTAL DARNS:";
    var lolspaces = spaceCalc(scoreboardHead, totalLols, lols);
    var darnspaces = spaceCalc(scoreboardHead, totalDarns, darns);
    var lolLine = totalLols + lolspaces + lols;
    var darnLine = totalDarns + darnspaces + darns;
    var scoreboard = "-------------SCOREBOARD-------------\n\n" + lolLine + "\n" + darnLine;
    console.log('Scoreboard is: ', scoreboard);
    return scoreboard;
}

module.exports = {
  scoreboard: function(forParse) {
    var lolTrigger = /(lol|\blol)/ig;
    var darnTrigger = /(darn|\bdarn)/ig;
    var botRegexScoreboard = /\/scoreboard/i;
    var request = require('request');
    var jsonObj, lolCount, darnCount, returnval;
    var count = 0;

    request('https://api.myjson.com/bins/4xupz', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      jsonObj = JSON.parse(body);
      lolCount = jsonObj.lols;
      darnCount = jsonObj.darns;
      if( forParse && botRegexScoreboard.test(forParse)) {
        returnval = getScoreboard(lolCount, darnCount);
        console.log("RETURN VAL: ", returnval);
        return returnval;
      } else {
        if( lolTrigger.test(forParse)) {
          count = (forParse.match(lolTrigger) || []).length;
          lolCount += count;
        }
        if( darnTrigger.test(forParse)) {
          count = (forParse.match(darnTrigger) || []).length;
          darnCount += count;
        }
        request({ url: 'https://api.myjson.com/bins/4xupz', method: 'PUT', json: {lols: lolCount, darns: darnCount}});
        return 0;
      }
    }
  });
  //return 0;
  }
}