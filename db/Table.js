export default class Table{
    constructor(){
        this.datastore = [];
        return this;
    }


    GetRowById(id){
        return new Promise(resolve => {
            this.datastore.findOne({_id: id}, (err, row) => {
                if(!err){
                    resolve(row)
                }
            })
        })
    }

    GetRowByValue(col, value){
        return new Promise(resolve => {
            this.datastore.find({col: value}, (err, rows) => {
                if(!err){
                    resolve(rows)
                }
            })
        })
    }
}