import Table from './Table.js';

export default class Database{
    constructor(){
        this.tables = {};
        return this;
    }

    AddTable(name){
        this.tables[name] = new Table(name)
    }

    TableExists(name){
        return (typeof this.tables[name] !== 'undefined') ? true : false;
    }
}