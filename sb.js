// Non-breaking spaces save the day
var spaceCalc = function (sbheader, header, obj) {
  var num = sbheader.length - (String(obj).length + header.length);
  return Array(num+1).join('\u00A0');
}

//pointless test change

var getScoreboard = function (lols, darns, date) {
    console.log('getScoreboard called');
    var scoreboardHead = "-------------SCOREBOARD-------------";
    var totalLols = "TOTAL LOLS:";
    var totalDarns = "TOTAL DARNS:";
    var lolspaces = spaceCalc(scoreboardHead, totalLols, lols);
    var darnspaces = spaceCalc(scoreboardHead, totalDarns, darns);
    var lolLine = totalLols + lolspaces + lols;
    var darnLine = totalDarns + darnspaces + darns;
    var scoreboard = "-------------SCOREBOARD-------------\n\n" + lolLine + "\n" + darnLine + "\n\n---------Since "+date+"---------";
    console.log('Scoreboard is: ', scoreboard);
    return scoreboard;
}

var scoreboard = function (forParse, resp) {
  if( forParse.group_id !== '23073839' ) {
    var lolTrigger = /(lol|\blol)/ig;
    var darnTrigger = /(darn|\bdarn)/ig;
    var botRegexScoreboard = /\/scoreboard/i;
    var request = require('request');
    var jsonObj, lolCount, darnCount, currentDate, returnval = 0;
    var count = 0;

    request('https://api.myjson.com/bins/4xupz', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var jsonObj = JSON.parse(body);
        var lolCount = jsonObj.lols;
        var darnCount = jsonObj.darns;
        var currentDate = jsonObj.date;
        if( forParse.text && botRegexScoreboard.test(forParse.text)) {
          returnval = getScoreboard(lolCount, darnCount, currentDate);
          resp.res.writeHead(200);
          postMessage(returnval, false);
          resp.res.end();
        } else {
          if( forParse.group_id !== '23073839' ) {
            if( lolTrigger.test(forParse.text)) {
              count = (forParse.text.match(lolTrigger) || []).length;
              lolCount += count;
            }
            if( darnTrigger.test(forParse.text)) {
              count = (forParse.text.match(darnTrigger) || []).length;
              darnCount += count;
            }
          }
          request({ url: 'https://api.myjson.com/bins/4xupz', method: 'PUT', json: {lols: lolCount, darns: darnCount, date: currentDate}});
          returnval = 0;
        }
      } else {
        returnval = 0;
      }
    });
  }
}

module.exports = {
  scoreboard: scoreboard,
  getScoreboard: getScoreboard,
  spaceCalc: spaceCalc
}