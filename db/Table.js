import Datastore from 'nedb';

export default class Table{
    constructor(name){
        this.datastore = new Datastore({filename: `db/${name}.db`, autoload: true});
        this.getMaxId().then(maxId => {
            console.log(`Max id for ${this.datastore.filename} is ${maxId}`)
            this.MaxId = maxId;
            return this;
        })
    }

    SetItem(data){
        return new Promise(resolve => {
            this.RowExist(data).then(exists => {
                if(!exists){ // row does not exist
                    delete data._id
                    this.MaxId += 1;
                    data.posted_id = this.MaxId;

                    this.datastore.insert(data, (err, res) => { // insert new row
                        if(err){
                            resolve({error: err})
                        }else{
                            resolve(res)
                        }
                    })
                }else{ // row exists
                    this.isTechLocked(data).then(locked => {
                        if(!locked){
                            this.datastore.update({ _id: data._id }, { $set: data }, (err, numReplaced) => { // update row
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

    isTechLocked(data){
        return new Promise(resolve => {
            this.datastore.findOne({ _id: data._id }, (err, row) => {
                if (err) {
                    console.error(err);
                    resolve(true);
                    return;
                }
    
                console.log("Row found: ", row);
    
                if (row && Date.now() <= row.date.getTime() + (5 * 60 * 1000)) {
                    console.log('not locked');
                    resolve(false);
                } else {
                    console.log('locked');
                    resolve(true);
                }
            })
        })
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
            var limit = 40;
            var skip = props.page * 40;


            this.datastore.find(props.query).skip(skip).limit(limit).sort({date: -1}).exec((err, rows) => {
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