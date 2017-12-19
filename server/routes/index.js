(function() {
    var express = require('express');
    var router = express.Router();
    var mongojs = require('mongojs');
    var db = mongojs('mongodb://admin:admin123@ds161136.mlab.com:61136/gis', ['images']);
    var request = require('request');
    var stream = require('stream');
    var cheerio = require('cheerio');
    var fs = require("fs");
    var path = require('path');

    /* GET home page. */
    router.get('/', function(req, res) {
      res.render('index');
    });
    router.get('/api/search', function(req, res) {
        db.images.find(function(err, data) {
          res.json(data);
        });
      });
      router.put('/api/getFiles', function(req, res) {
        console.log(req.body.dest);
        });
    router.post('/api/search', function(req, res) {
        var query = req.body.image;
        console.log(req.body.image);
        var chunks = [];
        var Imagedata;
        var url = 'http://images.google.com/search?tbm=isch&q=' + encodeURIComponent(query);
        return new Promise((resolve, reject) => {
          request.get({
            url: url
          }, function(err, resp, html) {
            if (err) {
              reject(err);
            }
            var $ = cheerio.load(html);
            var images = $('img').map(function() {
              return $(this).attr('src')
            }).get()
            if (images.length >= 15) {
              Imagedata = images.slice(0, 15);
              resolve(Imagedata);
            }
          })
        }).then(Imagedata => {
            function streamToBuffer(stream) {
              return new Promise((resolve, reject) => {
                  let buffers = [];
                  stream.stream.on('error', reject);
                  stream.stream.on('data', (data) => buffers.push(data))
                  stream.stream.on('end', () => resolve({data:Buffer.concat(buffers)}))
                  });
              }
              var promises = Imagedata.map(file => {
                var EachImage = request.get({
                  url: file,
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
                  }
                }, function(error, response, body) {
                  if (error) {
                    console.log(error);
                  }
                })
                var check=EachImage.on('response', function(response) {
                  response.on('data', function(data) {
                    console.log('received ' + data.length + ' bytes of compressed data')
                  })
                })
                return streamToBuffer({stream:check});
              });
              Promise.all(promises).then(saveImg => {
                var fs = require("fs")
                saveImg.forEach(function(item,index) {
                  if (!fs.existsSync(process.env.UPLOAD_DIR + req.body.image + "/")) {
                    fs.mkdirSync(process.env.UPLOAD_DIR + req.body.image + "/");
                  }
                  fs.writeFile(process.env.UPLOAD_DIR + req.body.image + "/" + req.body.image + index + ".JPEG", item.data, function(err) {
                    if (err) {
                      reject(err)
                    } else {}
                  });
                })
                console.log('done');
                var json={path:process.env.UPLOAD_DIR + req.body.image,key:req.body.image}
                db.images.insert(json, function(err, data) {
                  res.json(data);
                });
              }).catch(err => {
                // handle I/O error
                console.error(err);
              });
            })
        });

      module.exports = router;

    }());
