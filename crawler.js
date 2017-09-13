var crawls = require('crawl');
var fs = require('fs');

var URL = 'https://www.atypicom.fr/';

crawls.crawls(URL, function(err, pages) {
    if (err) {
        console.error('An error occured', err);
        return;
    }
    //console.log(JSON.stringify(pages));
    //fs.appendFileSync('output.json', JSON.stringify(pages), function (err) {
    //fs.appendFile('output.json', JSON.stringify(pages), function (err) {
    fs.writeFile('crawls/output.json', JSON.stringify(pages), function (err) {
        if (err) throw err;
        console.log('Done !');
    });
});