var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	rss = require('rss'),
	formidable = require('formidable'),
	fs = require('fs'),
	jsonfile = require('jsonfile');
	

//server config
var port = process.env.PORT || 5118;

//global function
function readdata() {
	return jsonfile.readFileSync('./data.json');
}
function writefile(obj) {
	jsonfile.writeFileSync('./data.json', obj);
}

//code
app.get('/add', function(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write('<form action="uploadfile" method="post" enctype="multipart/form-data">');
	res.write('<input type="file" name="filetoupload"><br>');
	res.write('<input type="submit">');
	res.write('</form>');
	return res.end();
})

app.post('/uploadfile', function(req, res) {
	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
    var oldpath = files.filetoupload.path;
    var newpath = './upload/' + files.filetoupload.name;
    fs.rename(oldpath, newpath, function (err) {
		if (err) throw err;
		var data = readdata();
		var d = new Date();
		var nowdate = d.getFullYear()+(d.getMonth()+1)+d.getDate();
		if (data[nowdate]) {
			data[nowdate] = {};
		}
		data[nowdate].file = files.filetoupload.name;
		res.write('File uploaded and moved!');
		res.end();
    });
	});
})


app.get('/json', function(req, res) {
	res.json(readdata());
});

app.use('/download', express.static('./upload'));

app.get('/lesson/:date', function(req, res) {
	var data = readdata();
	var thislesson = data[req.params.date];
	res.write("<h1>"+thislesson.title+"</h1><hr />");
	res.write("<p>"+thislesson.detail+"</p><hr />");
	res.write("<h1><a href=\"/download/"+thislesson.file+"\">Download lesson file</a></h1>");
	res.end();
})

app.listen(port, function(){console.log("Lesson manager developed by Andrew is running on port: "+port);});