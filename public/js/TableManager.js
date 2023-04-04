export default class TableManager{
    constructor(){
        this.tables = [];
    }

    AddTable(table){
        this.tables[table.table_name] = table;
    }
}