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
GrenventoryDB.AddTable('pick_tickets');


var db_schema = {
    
    pick_tickets:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string'},
    ],

    parts_needed_list:[
        {part_name:'string', posted_date:'string', ordered:'string'}
    ],

    inventory:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', reason:'string'},
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string', posted_date:'string', posted_by:'string'},
    ],

    pick_tickets:[
        {}
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
                GrenventoryDB.tables[props.table_name].SetItem(row).then(res => {
                //datastore.insert(row, (err, res) => {
                    console.log(res)
                })
            })
        });
        resolve();
    });
}

function Query(props){
    var query_mode = (typeof props.query !== 'undefined') ? 'advanced' : 'easy';
    var table_name = props.table_name;
    return new Promise(resolve => {
        if(GrenventoryDB.TableExists(table_name)){
            if(query_mode == 'advanced'){
                var p;
                if(typeof props.query == 'object'){
                    p = props.query;
                }else if(typeof props.query == 'string'){
                    var queryStr = `(${props.query})`; // wrap the query in parentheses to make it a valid expression
                    p = eval(queryStr)
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
                GrenventoryDB.tables[table_name].Query({query:p, page: props.page}).then(docs => {
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

function Count(table_name){
    console.log(table_name)
    return new Promise(resolve => {
        GrenventoryDB.tables[table_name].Count().then(count => {
            resolve({count: count})
        })
    })
}


export default function API() {
    'use strict';
    var API = express.Router();

    API.use( ( req, res, next ) => {
        next()
    })   

    API.post('/db_schema', (req, res) => {
        console.log(req.body)
        var user = req.body.user;
        var isAdminSchema = req.body.isAdminSchema;
        var table_name = req.body.table_name;
        var index = isAdminSchema == 'true' ? 1 : 0;
        if(db_schema[table_name][index] === undefined){
            res.json(db_schema[table_name][0])
        }else{
            res.json(db_schema[table_name][index])
        }
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
        GrenventoryDB.tables.users.datastore.find({}, (err, rows) => {
            rows.forEach(row => {
                delete row.password;
                delete row._id;
            })
            res.json(rows);
        })
    })

    API.post('/set_table_data', (req, res) => {
        var user = req.body.user;
        var data = req.body.data;
        var table_name = req.body.table_name;
        console.log(`table name is ${table_name}`)
        console.log(data)
        data.date = new Date();
        data.posted_date = data.date;
        data.by = user.first_name.charAt(0) + user.last_name.charAt(0);
        console.log(data)

        GrenventoryDB.tables[table_name].SetItem(data).then(ret => {
            res.json(ret)
        })
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
        GrenventoryDB.tables.users.datastore.find({}, (err, rows) => {
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

    API.post('/Query', (req, res) => {
        Query(req.body).then(rows => {
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
        console.log(req)
        const fileBuffer = new Buffer(req.files.data.data, 'ArrayBuffer');

        // Parse Excel file buffer into workbook object
        const workbook = XLSX.read(fileBuffer, { type: 'buffer', cellDates: true, });

        // Loop through each sheet in the workbook
        var count = 0;
        workbook.SheetNames.forEach(sheetName => {
            const sheet = workbook.Sheets[sheetName];
            const rows = XLSX.utils.sheet_to_json(sheet);
            if(rows.length == 0){
                res.json({error: 'No rows found'})
            }else{
                rows.forEach(row => {
                    console.log('DATE')
                    console.log(row.date)
                    console.log(row.posted_date)
                    
                    setTimeout(() => {
                    GrenventoryDB.tables[req.body.table_name].SetItem(row).then(ret => {
                    //.datastore.insert(row, (err, ret) => {
                        count++
                        if(count == rows.length){
                            res.json({success: 'Inserted ' + count + ' rows'})
                        }
                    })
                    }, 50)
                })
            }
        });
    })

    API.post('/export_xlsx', (req, res) => {
        var current_query = req.body.current_query;
        var filename = req.body.filename.includes('.xlsx') ? req.body.filename : req.body.filename + '.xlsx';
        console.log(typeof current_query)
        if(typeof current_query == 'object'){
            Count('inventory').then(count => {
                current_query.skip = 0;
                Query({page: 'all', table_name: 'inventory', query:current_query.query}).then(data => {
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
                        Object.keys(record).forEach(columnName =>{
                            if(columnName == '_id' || columnName == 'posted_id'){
                                return
                            }
                            console.log(columnName)
                            console.log(Object.keys(db_schema['inventory'][1]).indexOf(columnName))
                            console.log(Object.keys(db_schema['inventory'][1]).indexOf(columnName) + 1)
                            var col_index = Object.keys(db_schema['inventory'][1]).indexOf(columnName) + 1

                            if(typeof record[columnName] == 'string'){
                                ws.cell(rowIndex, col_index).string(record[columnName])
                            }else if(typeof record[columnName] == 'number'){
                                ws.cell(rowIndex,col_index).number(record[columnName])
                            }else if(typeof record[columnName] == 'object'){
                                var d = new Date(record[columnName])
                                var f = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear()    
                                ws.cell(rowIndex, col_index).string(f)
                            }
                        })
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
            })
        }else{
            res.json({error: 'current_query is not a string'})
        }
    })

    API.post('/Count', (req, res) => {
        var table_name = req.body.table_name;
        Count(table_name).then(count => {
            res.json(count)
        })
    })

    return API;    
};