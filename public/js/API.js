const API = {
    http_fetch(url, data, method){
        return new Promise(resolve => {
            var opts = {
                    method: method,
                    headers:{'Content-Type': 'application/json'}
                }
    
            if(method == "POST"){
                opts.body = JSON.stringify(data);
            }
            fetch(`${url}`, opts).then(response => response.json())
                    .then((data) => {
                        resolve(data)
                })
        })
    },

    set_row(table_name, data){
        return new Promise(resolve => {
            this.http_fetch(`/API/set_row`, {table_name: table_name, data: data}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    get_row(table_name, row_uuid){
        return new Promise(resolve => {
            this.http_fetch('/API/get_row', {table_name: table_name, row_uuid: row_uuid}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    get_rows(table_name){
        return new Promise(resolve => {
            this.http_fetch('/API/get_rows', {table_name: table_name}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    get_schema(table_name){
        return new Promise(resolve => {
            this.http_fetch('/API/db_schema', {}, "GET").then(res => {
                resolve(res[table_name]);
            })
        })
    },

    
    get_inventory(){
        return new Promise(resolve => {
            
        })
    }
    
}


const APISingleton = API;

window.API = APISingleton // web

export default window.API // this will initialise the singleton instantly
