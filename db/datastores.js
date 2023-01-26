const Datastore = require('nedb');

//setup NeDB databases
module.exports = { 
    tables: new Datastore({filename:'db/tables.db', autoload: true}),
    customers: new Datastore({filename: 'db/customers.db', autoload: true}),
    inventory: new Datastore({filename: 'db/inventory.db', autoload: true}),
}