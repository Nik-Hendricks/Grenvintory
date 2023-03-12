// Created 6:30 PM 10/28/2021 Nik Hendricks
// reused 8:19 PM 1/25/23 Nik Hendricks
// routes/api.js
//var fs = require('fs')
//const xl = require('excel4node');
//var Database = require('../db/Database.js');

import fs from 'fs'
import * as xl from 'excel4node'
import Database from '../db/Database.js'
import uniqid from 'uniqid'
import stream from 'stream'
import express from 'express'
import XLSX from 'xlsx';
import multer from 'multer'
const upload = multer();

var GrenventoryDB = new Database();

GrenventoryDB.AddTable('inventory');
GrenventoryDB.AddTable('users');
GrenventoryDB.AddTable('parts_needed_list');


var db_schema = {
    
    pick_tickets:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string'},
    ],

    parts_needed_list:[
        {part_name:'string', date_posted:'string', ordered:'string'}
    ],

    inventory:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string'},
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string', posted_date:'string', posted_by:'string'},
    ]
}
//private functions


function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, {type: 'array'});

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(worksheet, {header: 1});

      // remove the header row
      rows.shift();

      // resolve with the parsed rows
      resolve(rows);
    };

    reader.onerror = (e) => {
      reject(e);
    };

    reader.readAsArrayBuffer(file);
  });
}

function importXLSX(props) {
    return new Promise(resolve => {
        console.log(props.files);
        const fileBuffer = new Buffer(props.files.data.data, 'ArrayBuffer');

        // Parse Excel file buffer into workbook object
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        // Loop through each sheet in the workbook
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);
            console.log(rows);
            rows.forEach(row => {
                console.log(row)
                GrenventoryDB.tables[props.table_name].datastore.insert(row, (err, res) => {
                    console.log(res)
                })
            })
        });

        resolve();
    });
}

function _query(props){
    console.log(props)
    var query_mode = (typeof props.query !== 'undefined') ? 'advanced' : 'easy';
    var table_name = props.table_name;
    return new Promise(resolve => {
        if(GrenventoryDB.TableExists(table_name)){
            if(query_mode == 'advanced'){
                if(typeof props.query == 'object'){
                    var p = props.query;
                }else if(typeof props.query == 'string'){
                    console.log('str')
                    var queryStr = `(${props.query})`; // wrap the query in parentheses to make it a valid expression
                    var p = eval(queryStr)
                }
                Object.entries(p).forEach(([key, value]) => {
                    if(key == '$and'){
                        p[key].forEach((e, i) => {
                            Object.entries(e).forEach(([k, v]) => {
                                p[key][i][k] = new RegExp(v, 'i')
                            })
                        })
                    }else{
                        p[key] = new RegExp(value, 'i')
                    }
                })
                GrenventoryDB.tables[table_name].datastore.find(p, (err, docs) => {
                    console.log(docs)
                    resolve(docs)
                })
            }else{
                resolve({error:'not implemented'})
            }
        }else{
            resolve({error:'table does not exists'})
        }
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
        if(GrenventoryDB.TableExists(table_name)){
            GrenventoryDB.tables[table_name].datastore.find({}, (err, rows) => {
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
        if(GrenventoryDB.TableExists(table_name)){
            datastores[table_name].insert(data, (err, res) => {
                console.log(res)
                resolve(res)
            })
        }else{
            resolve({error:'table does not exists'})
        }
    })
}

function _update_row(table_name, data){
    return new Promise(resolve => {
        GrenventoryDB.tables[table_name].datastore.update({ _id: data._id }, { $set: data }, {}, function (err, numReplaced) {
            if (err) {
              resolve({error: err})
            } else if (numReplaced === 0) {
              resolve({error: 'Record not found'})
            } else {
              resolve({success: 'Record updated'})
            }
        });
    })
}




export default function API() {
    'use strict';
    var API = express.Router();

    API.use( ( req, res, next ) => {
        next()
    })   

    API.post('/db_schema', (req, res) => {
        var user = req.body.user;
        var isAdminSchema = req.body.isAdminSchema;
        var table_name = req.body.table_name;
        var index = isAdminSchema ? 1 : 0;
        res.json(db_schema[table_name][index])
    })
    
    API.post('/set_row', (req, res) => {
        var user = req.body.user;
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

    API.post('/create_user', (req, res) => {
        var first_name = req.body.first_name;
        var last_name = req.body.last_name;
        var username = req.body.username;
        var password = req.body.password;
        var permission_level = req.body.permission_level;
        if((username == null || undefined) || (permission_level == null || undefined)){
            return
        }else{
            _set_row('users', {first_name: first_name, last_name: last_name, username, username, password: password, permission_level: permission_level});
        }
    })
    
    API.post('/get_users', (req, res) => {
        _get_rows('users').then(rows => {
            rows.forEach(row => {
                delete row.password;
                delete row._id;
            })
            res.json(rows);
        })
    })

    API.post('/get_inventory', (req, res) => {
        _get_rows('inventory').then(rows => {
            res.json(rows);
        })
    })

    API.post('/get_inventory_by_user', (req, res) => {
        var user = req.body.user;
        _get_rows('inventory').then(rows => {
            var user_rows = rows.filter(row => {
                return row.by == `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
            })
            res.json(user_rows);
        })
    })

    API.post('/set_table_data', (req, res) => {
        var user = req.body.user;
        var data = req.body.data;
        var table_name = req.body.table_name;
        console.log(`table name is ${table_name}`)
        data.date_posted = new Date(data.date);

        GrenventoryDB.tables[table_name].SetItem(data).then(ret => {
            res.json(ret)
        })
    })

    API.post('/set_inventory', (req, res) => {
        var user = req.body.user;
        var data = req.body.data;
        data.date = new Date(data.date);
        console.log('WEIRD')
        GrenventoryDB.tables.inventory.SetItem(data).then(ret => {
            res.json(ret)
        })
    })


    API.post('/export_xlsx', (req, res) => {
        var current_query = req.body.current_query;
        var filename = req.body.filename.includes('.xlsx') ? req.body.filename : req.body.filename + '.xlsx';
        console.log(typeof current_query)
        if(typeof current_query == 'object'){
            _query(current_query).then(data => {
                const wb = new xl.Workbook();
                const ws = wb.addWorksheet('Inventory');
    
                //Write Column Title in Excel file
                let headingColumnIndex = 1;
                Object.entries(db_schema['inventory'][1]).forEach(heading => {
                    ws.cell(1, headingColumnIndex++)
                        .string(heading[0])
                });
    
                //Write Data in Excel file
                let rowIndex = 2;
                data.forEach( record => {
                    let columnIndex = 1;
                    Object.keys(record).forEach(columnName =>{
                        ws.cell(rowIndex,columnIndex++)
                            .string(record [columnName])
                    });
                    rowIndex++;
                }); 
                wb.writeToBuffer().then(buffer => {
                    console.log(filename)
                    res.set({
                      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'Content-Disposition': 'attachment; filename=' + filename,
                      'Content-Length': buffer.length
                    });
                    res.send(buffer);
                  }).catch(err => {
                    console.error('Error sending file:', err);
                    res.status(500).send('Error sending file');
                  });
            })
        }else{
            res.json({error: 'current_query is not a string'})
        }
    })

    API.post('/check_auth', (req, res) => {
        var user = req.body.user;
        if(user != null){
            console.log(user);
            console.log(user.permission_level)
            if(user.permission_level > 0){
                res.json({auth: 'prompt'})
            }else{
                res.json({auth: true, user: user})
            }
        }else{
            res.json({auth: false})
        }
    })

    API.post('/login', (req, res) => {
        var username = req.body.username;
        var password = req.body.password;
        _get_rows('users').then(rows => {
            var user = rows.find(row => row.username == username);
            if(user != null){
                if(user.password == password){
                    res.json({user: user, auth: true})
                }else{
                    res.json({auth: false})
                }
            }else{
                res.json({auth: false})
            }
        })
    })


    API.post('/_query', (req, res) => {
        var field = req.body.field;
        var value = req.body.value;
        var table_name = req.body.table_name;
        console.log(value)
        console.log(field)
        _query(table_name, field, value).then(rows => {
            res.json(rows);
        })
    })

    API.post('/Query', (req, res) => {
        _query(req.body).then(rows => {
            res.json(rows);
        })
    })

    API.post('/set_parts_needed', (req, res) => {
        var db = datastores['parts_needed_list'];
        db.findOne({ list: 'main' }, (err, existingRow) => {
            if(existingRow){
                datastores['parts_needed_list'].update({ list: 'main' }, {list: 'main', data: req.body.data}, { upsert: true }, (err, numReplaced) => {
                    console.log(numReplaced)
                })
            }else{
                datastores['parts_needed_list'].insert({list: 'main', data: req.body.data}, (err, numReplaced) => {
                    console.log(numReplaced)
                })
            }
            res.json({success: true})
        })
    })

    API.post('/get_parts_needed', (req, res) => {
        GrenventoryDB.tables['parts_needed_list'].datastore.find({ list: 'main' }, (err, docs) => {
          console.log(docs)  
          res.json(docs)
        })
    })

    API.post('/delete_row', (req, res) => {
        var table_name = req.body.table_name;
        var id = req.body._id;
        console.log(table_name)
        GrenventoryDB.tables[table_name].RemoveItem(id).then(ret => {
            res.json(ret)
        })
    })



    API.post('/import_xlsx', (req, res) => {
        console.log(req.files);
        const fileBuffer = new Buffer(req.files.data.data, 'ArrayBuffer');

        // Parse Excel file buffer into workbook object
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

        // Loop through each sheet in the workbook
        var count = 0;
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);
            console.log(rows);
            if(rows.length == 0){
                res.json({error: 'No rows found'})
            }else{
                rows.forEach(row => {
                    console.log(row)
                    GrenventoryDB.tables[req.body.table_name].datastore.insert(row, (err, ret) => {
                        count++
                        if(count == rows.length){
                            res.json({success: 'Inserted ' + count + ' rows'})
                        }
                    })
                })
            }
        });
    })


    return API;
    
};