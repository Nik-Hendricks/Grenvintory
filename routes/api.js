// Created 6:30 PM 10/28/2021 Nik Hendricks
// reused 8:19 PM 1/25/23 Nik Hendricks
// routes/api.js
var fs = require('fs')
const xl = require('excel4node');
var datastores = require('../db/datastores.js')
var uniqid = require('uniqid'); 
var stream = require('stream');
var db_schema = {
    
    pick_tickets:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string'},
    ],

    inventory:[
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string'},
        {from:'string', to:'string', quantity:'number', item_name: 'string', serial_number:'serial_number', by:'string', reason:'string', date:'string', posted_date:'string', posted_by:'string'},
    ]
}
//private functions

function _query(table_name, field, value){
    return new Promise(resolve => {
        if(table_exists(table_name)){
            datastores[table_name].find({[field]: value}, (err, docs) => {
                console.log(docs)
                resolve(docs)
            })
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
                console.log(res)
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

    API.post('/set_inventory', (req, res) => {
        var user = req.body.user;
        var data = req.body.data;
        data.by = `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`
        _set_row('inventory', data).then(ret => {
          res.json(ret);
        })
    })

    API.post('/export_xlsx', (req, res) => {
        var current_query = req.body.current_query;


        _query('inventory', current_query.field, current_query.value).then(data => {
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('Worksheet Name');

            //Write Column Title in Excel file
            let headingColumnIndex = 1;
            Object.entries(db_schema['inventory']).forEach(heading => {
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
                res.set('Content-disposition', 'attachment; filename=' + 'file.xlsx');
                res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.send(buffer);
            })
        })
    })

    API.get('/download', function(req, res){
        res.sendFile(__dirname.split('routes')[0] + 'data.xlsx');
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


    API.post('/query', (req, res) => {
        var field = req.body.field;
        var value = req.body.value;
        var table_name = req.body.table_name;
        console.log(value)
        console.log(field)
        _query(table_name, field, value).then(rows => {
            res.json(rows);
        })
    })

    return API;
    
})();