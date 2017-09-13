var Crawler = require('simplecrawler');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');
var fs = require('fs');

var args = process.argv.slice(2);
console.log(typeof args[0]);

if(typeof args[0] == 'undefined'){
  throw new Error('Pas d\'URL entrée');
}

var writer = csvWriter({
  headers: [
    'url',
    'title',
    'description',
    'status'
  ]
})

var d = new Date();
var n = d.getTime();

writer.pipe(fs.createWriteStream('crawls/'+ args[0] + '_' + n + '-crawls.csv'));

var crawler = new Crawler('http://' + args[0]);
crawler.interval = 100;
crawler.maxCurrency = 6;
crawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
  var $ = cheerio.load(responseBuffer.toString('utf-8'));
  var cleanMeta = {
    url: queueItem.url,
    title: $('title').text()
  }
  var words = 0;
  var meta = $('meta');
  $('div').each(function(){
    var str = $(this).html().replace(/<[^>]*>/g,'').replace(/[^\w\s]/gi, '').replace(/\t/g,'').replace(/\s+/,' ');
    words += str.split(' ').filter(String).length;
  });
  cleanMeta['words'] = words;
  for(var i = 0; i < meta.length; i++){
    var el = meta[i].attribs;
    if(el.property){
      cleanMeta[el.property] = el.content;
    }else if(el.name){
      cleanMeta[el.name] = el.content;
    }
  }
  console.log(queueItem.url);
  writer.write(cleanMeta);

  return $("a[href]").map(function () {
    return $(this).attr("href");
  }).get();


})

crawler.on('complete', function(){
  writer.end();
});

crawler.on('crawlstart', function(){
  console.log('Crawler Start');
});

crawler.start();