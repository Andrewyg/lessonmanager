var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	rss = require('rss'),
	formidable = require('formidable'),
	fs = require('fs'),
	jsonfile = require('jsonfile');
	

//server config
var port = process.env.PORT || 5118;
app.use(bodyparser.urlencoded({ extended: false }));
app.set('view engine', 'pug');

//global function
function readdata() {
	return jsonfile.readFileSync('./data.json');
}
function writedata(obj) {
	jsonfile.writeFileSync('./data.json', obj);
}


//code
app.get('/', function(req, res) {
  var data = readdata();
  var postsarray = [];
  for(i=0; i<data.lessonlist.length; i++) {
    postsarray.push(data[data.lessonlist[i]]);
  }
	res.render('index.pug', {
		posts: postsarray
	});
})

app.get('/add', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<form action="addlesson" method="post" id="addlesson">');
	res.write('<h1>Title:</h1><input type="text" name="title"><br><h1>Summary:</h1><input type="text" name="summary"><br><h1>Detail:</h1><textarea form="addlesson" name="detail"></textarea><br>');
	res.write('<input type="submit">');
	res.write('</form>');
	return res.end();
})

app.use('/addlesson', function(req, res) {
	var data = readdata();
	var d = new Date();
	var nowdate = d.getFullYear().toString()+(d.getMonth()+1).toString()+d.getDate().toString();
	
	
	if (!data[nowdate]) {
		data[nowdate] = {};
	}
	
	data[nowdate].title = req.body.title;
  data[nowdate].summary = req.body.summary;
	data[nowdate].detail = req.body.detail;
  data[nowdate].url = "/lesson/"+nowdate;
  data[nowdate].date = d.getFullYear().toString()+"/"+(d.getMonth()+1).toString()+"/"+d.getDate().toString();
	data.lessonlist.push(nowdate);
	data.newest = nowdate;
	jsonfile.writeFileSync('./data.json', data);
	res.redirect(302, '/addfile');
	//res.end();
})

app.get('/addfile', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<form action="uploadfile" method="post" enctype="multipart/form-data">');
	res.write('<input type="file" name="filetoupload"><br>');
	res.write('<input type="submit">');
	res.write('</form>');
	return res.end();
})

app.post('/uploadfile', function(req, res) {
	var form = new formidable.IncomingForm();
	var data = readdata();
	var newfilename;
	var filesitem = 0;
    form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
	function hasfile(filename) {
		if(data.filelist.indexOf(filename) != -1) {
			filesitem++;
			console.log(filesitem);
			var filelength = filename.length;
			for(i=0; i<filename.length; i++) {
				if (filename.substr(filelength-i, 1) == ".") {
					if(filesitem == 1) {
						filename = filename.substr(0, filelength-i)+" ("+filesitem+")"+filename.substr(filelength-i);
					} else {
						filename = filename.substr(0, filelength-i-4)+" ("+filesitem+")"+filename.substr(filelength-i);
					}
					break;
				}
			}
			console.log(filename);
			newfilename = filename;
			return hasfile(newfilename);
		}
		
	}
	newfilename = files.filetoupload.name;
	hasfile(files.filetoupload.name);
	console.log(newfilename);
    var newpath = 'upload/' + newfilename;
    fs.rename(oldpath, newpath, function (err) {
		if (err) throw err;
		var d = new Date();
		var nowdate = d.getFullYear().toString()+(d.getMonth()+1).toString()+d.getDate().toString();
		if (!data[nowdate]) {
			data[nowdate] = {};
		}
		data[nowdate].file = newfilename;
		data.filelist.push(newfilename);
		writedata(data);
		res.end();
    });
	});
})


/*app.get('/json', function(req, res) {
	res.json(readdata());
});*/

app.use('/download', express.static('./upload'));

app.use('/files', express.static('./public'));

app.get('/lesson/:date', function(req, res) {
	var data = readdata();
	var thislesson = data[req.params.date];
	res.render('post', thislesson);
});

app.listen(port, function(){console.log("Lesson manager developed by Andrew is running on port: "+port);});