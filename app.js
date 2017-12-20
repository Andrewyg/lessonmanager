var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	rss = require('rss'),
	linebot = require('linebot'),
	jsonfile = require('jsonfile');
	
var bot = linebot({
  channelId: "1552968953",
  channelSecret: "00f59c7dd04d66f655c6042f8986354a",
  channelAccessToken: "2v+VzGgayupjoFfoA+R5iDRfnjzVS4BpqXXoyoGbHtRPvdLq3Im8B9ohgzACJU7vXfQbBG9amcx29tV2sxLqzjVDHyGCSKcpnKCNx3aun8h2rGsAQcGyrvM0+nBUZvnU6d//fnqVaBhV95QVoBybXgdB04t89/1O/w1cDnyilFU="
});
var linebotParser = bot.parser();
//server config
var port = process.env.PORT || 5118;

//global function
function readdata() {
	return jsonfile.readFileSync('./data.json');
}

//code
app.post('/api/line/recieve', linebotParser);

//line code
bot.on('message', function(event) {
  if (event.message.type = 'text') {
    var msg = event.message.text;
	  /*
	var data = readdata();
	if (msg.indexOf("最近課程") != -1) {
		event.reply(data[data.newest].url).then(function(data) {
		  // success
		  console.log(msg);
		}).catch(function(error) {
		  // error 
		  console.log('error');
		});
	}
	
	if (msg.indexOf("最近課程詳細資料") != -1) {
		event.reply(data[data.newest].detail).then(function(data) {
		  // success
		  console.log(msg);
		}).catch(function(error) {
		  // error 
		  console.log('error');
		});
	}
	
	if (msg.indexOf("課程列表") != -1) {
		event.reply(data.lessonlist).then(function(data) {
		  // success
		  console.log(msg);
		}).catch(function(error) {
		  // error 
		  console.log('error');
		});
	}
	
	
	if (msg.indexOf("的課程") != -1) {
		var lessondate = msg.substr(0, 4);
		event.reply(data[lessondate].url).then(function(data) {
		  // success
		  console.log(msg);
		}).catch(function(error) {
		  // error 
		  console.log('error');
		});
	}
	
	if (msg.indexOf("的課程的詳細資料") != -1) {
		var lessondate = msg.substr(0, 4);
		event.reply(data[lessondate].detail).then(function(data) {
		  // success
		  console.log(msg);
		}).catch(function(error) {
		  // error 
		  console.log('error');
		});
	}
	*/
	
    event.reply(msg).then(function(data) {
      // success
      console.log(msg);
    }).catch(function(error) {
      // error 
      console.log('error');
    });
  }
});




//demo


app.listen(port, function(){console.log("Lesson manager developed by Andrew is running on port: "+port);});
