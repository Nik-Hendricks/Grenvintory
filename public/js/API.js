const API = {
    /**
     * Determine the mobile operating system.
     * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
     *
     * @returns {String}
     */
    GetMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return "Windows Phone";
        }
        if (/android/i.test(userAgent)) {
            return "Android";
        }
        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return "iOS";
        }
        return "unknown";
    },

    http_fetch(url, data, method){
        return new Promise(resolve => {
            var opts = {
                    method: method,
                    headers:{'Content-Type': 'application/json'}
                }
    
            if(method == "POST"){
                opts.body = JSON.stringify(data);
            }
            fetch(`${url}`, opts)
            .then(response => {
              if (response.headers.get('content-type').indexOf('application/json') !== -1) {
                return response.json();
              } else {
                return response.blob().then(blob => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                  
                    // Try to extract the filename from the Content-Disposition header
                    const contentDisposition = response.headers.get('content-disposition');
                    if (contentDisposition) {
                      const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
                      if (filenameMatch) {
                        const filename = filenameMatch[1];
                        link.setAttribute('download', filename);
                      }
                    }
                  
                    document.body.appendChild(link);
                    link.click();
                    return null;
                  });
              }
            })
            .then(data => {
              if (data !== null) {
                resolve(data)
              }
            });
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

    get_schema(table_name, isAdminSchema){
        return new Promise(resolve => {
            this.http_fetch('/API/db_schema', {table_name: table_name, user: window.UserManager.current_user, isAdminSchema: isAdminSchema}, "POST").then(res => {
                resolve(res);
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



    update_inventory(data){
        return new Promise(resolve => {
            this.http_fetch('/API/update_inventory', {user: window.UserManager.current_user, data: data}, "POST").then(res => {
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

    export_xlsx(props){
        return new Promise(resolve => {
            this.http_fetch('/API/export_xlsx', {current_query: window.app.current_query, filename: props.filename}, "POST").then(res => {
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
    },

    get_parts_needed(){
        return new Promise(resolve => {
            this.http_fetch('/API/get_parts_needed', {}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    set_parts_needed(data){
        return new Promise(resolve => {
            this.http_fetch('/API/set_parts_needed', {data: data}, "POST").then(res => {
                resolve(res)
            })
        })
    },

    Query(props){
        return new Promise(resolve => {
            this.http_fetch('/API/Query', props, "POST").then(res => {
                resolve(res)
            })
        })
    },

    SetTableData(props){
        return new Promise(resolve => {
            console.log(props.table_name)
            this.http_fetch('/API/set_table_data', {table_name: props.table_name, user: window.UserManager.current_user, data: props.data}, "POST").then(res => {
                resolve(res);
            })
        })
    },
    
}


const APISingleton = API;

window.API = APISingleton // web

export default window.API // this will initialise the singleton instantly
