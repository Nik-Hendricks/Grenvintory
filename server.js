//1-4-23 Nik Hendricks 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const fs = require('fs');
var Datastore = require('nedb')
var API = require('./routes/api.js');


app.use(express.urlencoded({extended: true}))
app.use(express.json());
  
  
http.listen(80, () => {
  console.log("listening on 80")
})

app.get("/js/:file",(req, res) => {
    var file = req.param('file');
    res.header({
      'Content-Type': 'text/javascript',
      'Content-Size': getFilesizeInBytes(__dirname + '/public/js/' + file)
    });
    res.sendFile(__dirname + '/public/js/' + file)
})

app.get("/components/:file",(req, res) => {
  var file = req.param('file');
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes(__dirname + '/public/components/' + file)
  });
  res.sendFile(__dirname + '/public/components/' + file)
})

app.get("/css/:file",(req, res) => {
    var file = req.param('file');
    res.header({
      'Content-Type': 'text/css',
      'Content-Size': getFilesizeInBytes(__dirname + '/public/css/' + file)
    });
    res.sendFile(__dirname + '/public/css/' + file)
})

app.use('/API', API)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}