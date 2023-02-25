const UserManager = {
    
    load(){
        this.users = []
        return new Promise(resolve => {
            window.API.get_users().then(users => {
                users.forEach(user => {
                    this.users.push(user)
                })
                this.current_user = (window.localStorage.getItem('user') == null) ? this.users[0] : JSON.parse(window.localStorage.getItem('user')),
                resolve(this.users)
            })
        })
    },



    switchUser(user){
        return new Promise(resolve => {
            //if(user.permission_level > 0){
            //    //locked user server side login time
//
            //}
            window.localStorage.setItem('user', JSON.stringify(user))
            console.log(user);
            resolve(true);
        })
    }



}

const UserManagerSingleton = UserManager;

window.UserManager = UserManagerSingleton // web

export default window.UserManager // this will initialise the singleton instantly