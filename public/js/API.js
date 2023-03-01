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
            this.http_fetch(`/API/set_row`, {user: window.UserManager.current_user, table_name: table_name, data: data}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    get_row(table_name, row_uuid){
        return new Promise(resolve => {
            this.http_fetch('/API/get_row', {user: window.UserManager.current_user, table_name: table_name, row_uuid: row_uuid}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    get_rows(table_name){
        return new Promise(resolve => {
            this.http_fetch('/API/get_rows', {user: window.UserManager.current_user, table_name: table_name}, "POST").then(res => {
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

    set_inventory(data){
        return new Promise(resolve => {
            this.http_fetch('/API/set_inventory', {user: window.UserManager.current_user, data: data}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    get_inventory(){
        return new Promise(resolve => {
            this.http_fetch('/API/get_inventory', {user: window.UserManager.current_user}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    get_inventory_by_user(){
        return new Promise(resolve => {
            this.http_fetch('/API/get_inventory_by_user', {user: window.UserManager.current_user}, "POST").then(res => {
                resolve(res);
            })
        })
    },

    create_user(first_name, last_name, username, password, permission_level){
        return new Promise(resolve =>{ 
            this.http_fetch('/API/create_user', {first_name: first_name, last_name: last_name, username:username, password: password, permission_level: permission_level}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    get_users(){
        return new Promise(resolve => {
            this.http_fetch('/API/get_users', {}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    export_xlsx(){
        return new Promise(resolve => {
            this.http_fetch('/API/export_xlsx', {}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    check_auth(user){
        return new Promise(resolve => {
            this.http_fetch('/API/check_auth', {user: user}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    login(username, password){
        return new Promise(resolve => {
            this.http_fetch('/API/login', {username: username, password: password}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    sort(arr, type, ascending){
        if(type == 'date'){
            const sortedArray = arr.sort((a, b) => {
                const dateA = new Date(a['date']);
                const dateB = new Date(b['date']);
                let comparison = 0;
                if (dateA > dateB) {
                  comparison = 1;
                } else if (dateA < dateB) {
                  comparison = -1;
                }
                return ascending ? comparison : comparison * -1;
            });
            return sortedArray;
        }else{
            return arr;
        }
    }
    
}


const APISingleton = API;

window.API = APISingleton // web

export default window.API // this will initialise the singleton instantly
