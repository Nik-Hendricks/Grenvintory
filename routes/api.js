// Created 6:30 PM 10/28/2021 Nik Hendricks
// reused 8:19 PM 1/25/23 Nik Hendricks
// routes/api.js

var datastores = require('../db/datastores.js')
var uniqid = require('uniqid'); 
var db_schema = {
    customers:{name:'string', SO_number: 'number'},
    inventory:{to:'string', from:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', date: 'date'}
}
//private functions


function _create_game(name, image_url){
    if(!url){
        image_url = null;
    }
    datastore.games.insert({data_type:'game', name: name, image: image_url}, (err, doc) => {
        console.log("ADDED GAME " + name)
    })
}

function _create_post(title, content, author_public_uniqid){
    return new Promise(resolve => {
        var post_uniqid = uniqid();
        datastore.posts.insert({data_type:'post', uniqid: post_uniqid, title: title, content: content, author_public_uniqid: author_public_uniqid}, (err, doc) => {
            datastore.subscriptions.find({to: author_public_uniqid}, (err, subscribers) => {
                console.log(subscribers)
                for(var i = 0; i < subscribers.length; i++){
                    var subscriber_public_uniqid = subscribers[i].from;
                    console.log(subscriber_public_uniqid)
                    datastore.post_feeds.insert({subscriber_public_uniqid: subscriber_public_uniqid, post_uniqid: post_uniqid}, (err, doc) => {
                        if(i == subscribers.length -1){
                            resolve(doc)
                        }
                    })
                }
                
            })
        })

    })
}


function _create_user(username, email, password){
    return new Promise(resolve => {
        var _uniqid = uniqid();
        var public_uniqid = uniqid();
        datastore.users.insert({data_type:'user', username:username, email: email, password: password, permisions: [], public_uniqid: public_uniqid, uniqid:_uniqid }, (err, user) => {
            resolve(user)
        })
    })
}


function _get_row(table_uuid, row_uuid){
    return new Promise(resolve => {
        var table_name = datastores.tables.findOne({table_uuid: table_uuid}, (err, row) => {
            console.log(row)
            resolve(row)
        })
    })
}

function _get_rows(table_name){
    return new Promise(resolve => {
        if(table_exists(table_name)){
            datastores[table_name].find({}, (err, rows) => {
                if(!err){
                    resolve(rows);
                }
            })
        }else{
            resolve({error: 'table does not exist'})
        }
    })
}

function _set_row(table_name, data){
    return new Promise(resolve => {
        if(table_exists(table_name)){
            datastores[table_name].insert(data, (err, res) => {
                resolve(res)
            })
        }else{
            resolve({error:'table does not exists'})
        }
    })
}

function table_exists(table_name){
    return (typeof datastores[table_name] !== 'undefined') ? true : false;
}


module.exports = (() => {
    'use strict';
    var API = require('express').Router();

    API.use( ( req, res, next ) => {
        next()
    })   

    API.get('/db_schema', (req, res) => {
        res.json(db_schema)
    })
    
    API.post('/set_row', (req, res) => {
      var data = req.body.data;
      var table_name = req.body.table_name;
      _set_row(table_name, data).then(ret => {
        res.json(ret);
      })
    })
    
    API.post('/get_row', (req, res) => {
        var table_name = req.body.table_name;
        var row_uuid = req.body.row_uuid;
        _get_row(table_name, row_uuid).then(row => {
            res.json(row);
        })
    })

    API.post('/get_rows', (req, res) => {
        var table_name = req.body.table_name;
        _get_rows(table_name).then(rows => {
            res.json(rows);
        })
    })
    //public routes here
    
    return API;
})();