var express = require('express'),
	app = express(),
	bodyparser = require('body-parser'),
	rss = require('rss'),
	jsonfile = require('jsonfile');

//server config
var port = process.env.PORT || 5118;

//code
var RSS = require('rss');
 
/* lets create an rss feed */
var feed = new RSS({
    title: 'Andrew\'s RSS',
    description: 'description',
    feed_url: 'http://localhost:5118/',
    site_url: 'http://localhost:5118',
    managingEditor: 'Dylan Greene',
    webMaster: 'Dylan Greene',
    copyright: '2013 Dylan Greene',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60'
});
 
/* loop over data and add to feed */
feed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: '/article4?this&that', // link to the item 
    guid: '1123', // optional - defaults to url 
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories 
    author: 'Guest Author', // optional - defaults to feed author property 
    date: 'May 27, 2012', // any format that js Date can parse. 
});
 
// cache the xml to send to clients 
app.get('/rss.xml', function(req, res) {
	res.writeHead(200, {'Content-Type':'text/xml'});
	res.end(feed.xml({indent: true}));
})

app.get('/add', function(req, res) {
	feed.item({
		title:  'asda',
		description: 'asdasd',
		url: '/article4?this&that', // link to the item 
		categories: ['Category 1'], // optional - array of item categories 
		author: 'Guest Author', // optional - defaults to feed author property 
		date: 'May 27, 2012', // any format that js Date can parse. 
	});
})

app.listen(port, function(){console.log("Lesson manager developed by Andrew is running on port: "+port);});