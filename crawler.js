var crawl = require('crawl');
var fs = require('fs');

var URL = "http://www.cf2roues.com/";

crawl.crawl(URL, function(err, pages) {
    if (err) {
        console.error("An error occured", err);
        return;
    }
    //console.log(JSON.stringify(pages));
    //fs.appendFileSync('output.json', JSON.stringify(pages), function (err) {
    //fs.appendFile('output.json', JSON.stringify(pages), function (err) {
    fs.writeFile('output.json', JSON.stringify(pages), function (err) {
        if (err) throw err;
        console.log('Done !');
    });
});

