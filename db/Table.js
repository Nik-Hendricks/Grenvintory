import Datastore from 'nedb';

export default class Table{
    constructor(name){
        this.datastore = new Datastore({filename: `db/${name}.db`, autoload: true});
        return this;
    }


    SetItem(data){
        return new Promise(resolve => {
            this.RowExist(data).then(exists => {
                console.log(exists)
                if(!exists){
                    console.log(`Creating row...`)
                    delete data._id;
                    this.datastore.insert(data, (err, res) => {
                        console.log(`Id is ${res._id}`)
                        resolve(res)
                    })
                }else{
                    console.log(`Updating row... ${data._id}}`)
                    this.datastore.update({ _id: data._id }, { $set: data }, (err, numReplaced) => {
                        if(err){
                            resolve({error: err})
                        }else if(numReplaced === 0){
                            resolve({error: 'Record not found'})
                        }else{
                            resolve({success: 'Record updated'})
                        }
                    })
                }
            })
        })
    }

    Query(props){
        return new Promise(resolve => {
            if(props.fields){

            }else{
                this.datastore.find(props.query, (err, rows) => {
                    if(!err){
                        resolve(rows);
                    }
                })
            }
        })
    }

    GetItem(_id){

    }

    RemoveItem(_id){

    }

    RowExist(row){
        return new Promise(resolve => {
            console.log(row._id)
            if(!row._id || row._id == '' || row._id == undefined){
                resolve(false)
            }
            this.datastore.findOne({ _id: row._id }, (err, existingRow) => {
                resolve((existingRow) ? true : false);
            })
        })
    }
}