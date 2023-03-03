//1-4-23 Nik Hendricks 

import express from 'express'
const app = express();
import path from 'path'
import http from 'http';
import fs from 'fs'     
import uniqid from 'uniqid'
import bodyParser from 'body-parser'

import API from './routes/api.js'

//var API = require('./routes/api.js');
//routes
var httpServer = http.createServer(app);


app.use(express.urlencoded({extended: true}))
app.use(express.json());
  
  
httpServer.listen(80, () => {
  console.log("listening on 80")
})

app.get("/js/:file",(req, res) => {
    var file = req.param('file');
    res.header({
      'Content-Type': 'text/javascript',
      'Content-Size': getFilesizeInBytes('./public/js/' + file)
    });
    res.sendFile('./public/js/' + file, {root: './'})
})

app.get("/components/:file",(req, res) => {
  var file = req.param('file');
  res.header({
    'Content-Type': 'text/javascript',
    'Content-Size': getFilesizeInBytes('./public/components/' + file)
  });
  res.sendFile('./public/components/' + file, {root: './'})
})

app.get("/css/:file",(req, res) => {
    var file = req.param('file');
    res.header({
      'Content-Type': 'text/css',
      'Content-Size': getFilesizeInBytes('./public/css/' + file)
    });
    res.sendFile('./public/css/' + file, {root: './'})
})

app.use('/API', API())

app.get('/', (req, res) => {
    res.sendFile('./public/index.html', {root: './'})
})

function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}