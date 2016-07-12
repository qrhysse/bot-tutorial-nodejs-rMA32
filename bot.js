var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() { 
  var request = JSON.parse(this.req.chunks[0]);
  var botRegexsts = /Dr. Q, status(!|.)?/i;
  var botRegexBio = /from a biological/i;
  var botRegexWee = /(-|\s)kun/i;
  var botRegexDad = /(^dad$|\sdad)/i;
  var botRegexRip = /(^rip$|\srip)/i;
  var botRegexAlex = /(^actually$|\sactually)/i;
  var botRegexSandwich = /(^sandwich$|\ssandwich)/i;
  //var botRegexDadJoke = /(\bI'?\s*a?m\b)/g; // I am, I'm, Im, or Iam
  var botRegexDadJoke = /(^i'm|^im)\b/i;
      
  if(request.text && botRegexsts.test(request.text)) {
    this.res.writeHead(200);
    postMessage(cool(), false);
    this.res.end();
  } 
  else if(request.text && botRegexBio.test(request.text)) {
    var link = request.text;
    link = link.replace(/from a biological (perspective|standpoint),?/i, "")
    link = link.replace(/ /g, "+");
    link = link.replace("%", "%25");

    this.res.writeHead(200);
    postMessage("https://www.google.com/#safe=off&q="+link, true);
    this.res.end();
  //   var req = String(request.text);
  //   var helpVariable = req.split(/from a biological perspective,?/i);
  //   var help = helpVariable[jokeVariable.length-1];
  //   var linkHelp = help.replace(" ", "+");
  //   linkHelp = linkHelp.replace(",", "%2C");
  //   linkHelp = linkHelp.replace("'", "%27m");
  //   console.log("Help activated.");
  //   console.log(linkHelp);
  //   this.res.writeHead(200);
  //   postMessage("http://google.com/#safe=off&q="+linkHelp);
  //   this.res.end();
  } 
  
  else if(request.text && botRegexWee.test(request.text)) {
    this.res.writeHead(200);
    postMessage("Goddamn Weeaboo", false);
    this.res.end();
  } 

  else if( request.text && botRegexAlex.test(request.text)) {
    this.res.writeHead(200);
    postMessage("https://s32.postimg.org/ld1h4212t/alex.png", false);
    this.res.end();
  }
  
  else if(request.text && botRegexDad.test(request.text) && request.name !== "Dr. Q") {
    this.res.writeHead(200);
    postMessage("I'm not your fucking Dad.", false);
    this.res.end();
  }

  else if( request.text && botRegexSandwich.test(request.text)) {
    this.res.writeHead(200);
    postMessage("can i get a bbq huge pls tyty", false);
    this.res.end();
  }

  else if(request.text && botRegexRip.test(request.text) && request.name !== "Dr. Q") {
    this.res.writeHead(200);
    postMessage("https://s31.postimg.org/pjuh7qfxn/RIP.jpg", false);
    this.res.end();
  }
  
  else if(request.text && botRegexDadJoke.test(request.text) && request.name !== "Dr. Q") {
    //var req = request.text;
    //var repl = req.replace(botRegexDadJoke, "Hi");
    //var joke = repl + ", I'm Dad.";
    //var joke = "Hi " + botRegexDadJoke($2) + ", I'm dad.";
    var content = String(request.text);
    var jokeVariable = content.split(/.*?(i'm|im)/i);
    var joke = "Hi" + jokeVariable[jokeVariable.length-1] + ", I'm Dad.";
    console.log("Joke activated.");
    console.log(joke);
    
    // If the dad joke above contains the word dad
    if(request.text && botRegexDad.test(request.text)){
      console.log("don't care");
      this.res.writeHead(200);
      this.res.end();
    } else {
      this.res.writeHead(200);
      postMessage(joke, false);
      this.res.end();
    }
  }
  
  else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
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
