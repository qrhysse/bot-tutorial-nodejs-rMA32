var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() { 
  var request = JSON.parse(this.req.chunks[0]);
  var botRegexsts = /Dr. Q, status(!|.)?/i;
  var botRegexBio = /from a biological/i;
  var botRegexWee = /(-|\s[^a-z])kun/i;
  var botRegexDad = /(^dad$|\bdad[^a-z])/i;
  var botRegexRip = /(^r\.?i\.?p\.?$|\sr\.?i\.?p\.?)/i;
  var botRegexAlex = /(^actually$|\bactually[^a-z])/i;
  var botRegexSandwich = /(^sandwich$|\bsandwich[^a-z])/i;
  var lolTrigger = /(lol|\blol)/ig;
  var darnTrigger = /(darn|\bdarn)/ig;
  var botRegexScoreboard = /\/scoreboard/i;
  //var botRegexDadJoke = /(\bI'?\s*a?m\b)/g; // I am, I'm, Im, or Iam
  var botRegexDadJoke = /\bi'?m\s+/i;
  var botRegexThbby = /\?\s*$/i,
  var loldarnCount = JSON.parse('ld.json');
  
  console.log(loldarnCount);
  console.log(request);    
  
  if( request.name !== "Dr. Q" ) {
    if(request.text && botRegexsts.test(request.text)) {
      this.res.writeHead(200);
      postMessage(cool(), false);
      this.res.end();
    }

    if( request.text && lolTrigger.test(request.text)) {
      loldarnCount.lols++;
    }
    if( request.text && darnTrigger.test(request.text))) {
      loldarnCount.darns++;
    }
    if( request.text && botRegexScoreboard.test(request.text)) {
      var scoreboard = "-------------SCOREBOARD-------------\n\nTOTAL LOLS: " + loldarnCount.lols + "\n\nTOTAL DARNS: " + loldarnCount.darns;
      this.res.writeHead(200);
      postMessage(scoreboard, false);
      this.res.end();
    }
    
    if(request.text && botRegexBio.test(request.text)) {
      var link = request.text;
      link = link.replace(/from a biological (perspective|standpoint),?/i, "")
      link = link.replace(/ /g, "+");
      link = link.replace("%", "%25");

      this.res.writeHead(200);
      postMessage("https://www.google.com/#safe=off&q="+link, true);
      this.res.end();
    } 
    
    if(request.text && botRegexWee.test(request.text)) {
      this.res.writeHead(200);
      postMessage("Goddamn Weeaboo", false);
      this.res.end();
    }

    if( request.text && botRegexThbby.test(request.text)) {
      console.log("Thbby activated.");
      this.res.writeHead(200);
      postMessage("https://s32.postimg.org/l9cjr1411/idk.jpg", false);
      this.res.end();
    }

    if(request.text && botRegexDadJoke.test(request.text)) {
      var content = request.text;
      var jokeVariable = content.replace(/.*?\bi'?m\b/i, "" );
      var joke = "Hi" + jokeVariable + ", I'm Dad.";
      this.res.writeHead(200);
      postMessage(joke, false);
      this.res.end();
      // var contentLowercase = content.toLowerCase();
      // var contentArray = content.split(' ');
      // var jokeContent;
      // var contentLCArray = contentLowercase.split(' ');
      // var firstUpperIm = contentLCArray.indexOf("i'm");
      // var firstLowerIm = contentLCArray.indexOf("im");
      // var trueIndex = -69;

      // if( (firstUpperIm !== firstLowerIm ) ) {
      //   if( firstUpperIm > -1 ) {
      //     trueIndex = firstUpperIm;
      //   } else if( firstLowerIm > -1 ) {
      //     trueIndex = firstLowerIm;
      //   }
      //   if( trueIndex != -69 ) {
      //     contentArray.splice(0, trueIndex+1);
      //     jokeContent = contentArray.join(' ');
      //   }
      // }

      console.log("Joke activated.");
      console.log(joke);
    }

    if( request.text && botRegexAlex.test(request.text)) {
      this.res.writeHead(200);
      postMessage("https://s32.postimg.org/ld1h4212t/alex.png", false);
      this.res.end();
    }
    
    if(request.text && botRegexDad.test(request.text)) {
      this.res.writeHead(200);
      postMessage("I'm not your fucking Dad.", false);
      this.res.end();
    }

    if( request.text && botRegexSandwich.test(request.text)) {
      this.res.writeHead(200);
      postMessage("can i get a bbq huge pls tyty", false);
      this.res.end();
    }

    if(request.text && botRegexRip.test(request.text)) {
      this.res.writeHead(200);
      postMessage("https://s31.postimg.org/pjuh7qfxn/RIP.jpg", false);
      this.res.end();
    }
  }
}

function postMessage(response, isLink) {
  var botResponse, options, body, botReq;

  botResponse = response;
  if( isLink == false ) {
    botResponse = botResponse.replace(/%/g, " percent");
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


exports.respond = respond;
