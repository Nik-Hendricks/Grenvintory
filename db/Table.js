import Datastore from 'nedb';

export default class Table{
    constructor(name){
        this.datastore = new Datastore({filename: `db/${name}.db`, autoload: true});
        return this;
    }


    SetItem(data){
        
    }

    GetItem(_id){

    }

    RemoveItem(_id){

    }
}