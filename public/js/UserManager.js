import AuthenticationPrompt from '/components/AuthenticationPrompt.js';

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


    checkCanSwitchUser(user){
        return new Promise(resolve => {
            window.API.check_auth(user).then(res => {
                if(res.auth == true){
                    this.switchUser(res.user)
                    resolve(true);
                }else if(res.auth == 'prompt'){
                    var ap = new AuthenticationPrompt();
                    document.body.append(ap)
                    ap.init(password => {
                        window.API.login(user.username, password).then(res => {
                            if(res.auth == true){
                                this.switchUser(res.user)
                                resolve(true);
                            }else{
                                alert('Incorrect Password')
                                resolve(false);
                            }
                        })
                    })
                }

            })
        })
    },

    switchUser(user){
        this.current_user = user;
        window.localStorage.setItem('user', JSON.stringify(user))
        window.UserTabBar.switchTab(user.username);
        window.TableData.create_structure();
    },

    getInitials(){
        return this.current_user.first_name[0] + this.current_user.last_name[0]
    }

}

const UserManagerSingleton = UserManager;

window.UserManager = UserManagerSingleton // web

export default window.UserManager // this will initialise the singleton instantly