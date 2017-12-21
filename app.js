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
	res.write('<input type="file" name="lessonfile">');
	res.write('<input type="submit">');
	res.write('</form>');
	return res.end();
})

app.post('/uploadfile', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.lessonfile;
 
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('/upload/'+req.files.lessonfile.name, function(err) {
    if (err)
      return res.status(500).send(err);
 
    res.send('File uploaded!');
  });
});


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