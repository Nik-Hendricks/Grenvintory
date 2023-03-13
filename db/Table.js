import Datastore from 'nedb';

export default class Table{
    constructor(name){
        this.datastore = new Datastore({filename: `db/${name}.db`, autoload: true});
        this.getMaxId().then(maxId => {
            this.MaxId = maxId;
            return this;
        })
    }

    SetItem(data){
        return new Promise(resolve => {
            this.RowExist(data).then(exists => {
                console.log(exists)
                if(!exists){
                    console.log(`Creating row...`)
                    this.MaxId += 1;
                    data.posted_id = this.MaxId;
                    this.datastore.insert(data, (err, res) => {
                        console.log(`Id is ${res.posted_id}`)
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
      
    getMaxId() {
        return new Promise(resolve => {
            this.datastore.find({}).sort({ posted_id: -1 }).limit(1).exec((err, docs) => {
                let maxId = 0;
                if (docs.length > 0) {
                    maxId = docs[0].posted_id;
                }
                resolve(maxId);
            });
        });
    }

    Count(){
        return new Promise(resolve => {
            this.datastore.count({}, (err, count) => {
                resolve(count)
            })
        })
    }

    Query(props){
        return new Promise(resolve => {
            console.log(props)
            this.datastore.find(props.query).skip(props.skip).limit(props.limit).sort({posted_id: -1}).exec((err, rows) => {
                if(!err){
                    resolve(rows);
                }
            })
        })
    }

    GetItem(_id){

    }

    RemoveItem(_id){
        console.log(_id)
        return new Promise(resolve => {
            this.datastore.remove({ _id: _id }, {}, (err, numRemoved) => {
                if(err){
                    resolve({error: err})
                }else if(numRemoved === 0){
                    resolve({error: 'Record not found'})
                }else{
                    resolve({success: 'Record deleted'})
                }
            })
        })
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