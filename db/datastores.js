const Datastore = require('nedb');

//setup NeDB databases
module.exports = { 
    inventory: new Datastore({filename: 'db/inventory.db', autoload: true}),
    users: new Datastore({filename: 'db/users.db', autoload:true}),
    parts_needed_list: new Datastore({filename: 'db/parts_needed_list.db', autoload:true}),
}