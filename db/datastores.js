const Datastore = require('nedb');

//setup NeDB databases
module.exports = { 
    inventory: new Datastore({filename: 'db/inventory.db', autoload: true}),
}