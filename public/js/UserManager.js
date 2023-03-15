import AuthenticationPrompt from '/components/AuthenticationPrompt.js';
import Prompt from '/components/Prompt.js'

const UserManager = {
    
    load(){
        this.users = []
        return new Promise(resolve => {
            window.API.get_users().then(users => {
                users.forEach(user => {
                    this.users.push(user)
                })
                //this.current_user = (window.localStorage.getItem('user') == null) ? this.users[1] : JSON.parse(window.localStorage.getItem('user')),

                window.Dispatcher.on('LOAD', () => {
                    this.switchUser(users[0])
                })
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
                    var ap = new Prompt({type:'login'});
                    ap.init(password => {
                        window.API.login(user.username, password).then(res => {
                            if(res.auth == true){
                                this.switchUser(res.user)
                                resolve(true);
                            }else{
                                var p = new Prompt({error:true, title:'Login Error', text: 'Incorrect password'});
                                p.init();
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
        window.Dispatcher.dispatch('SWITCH_USER', user)
        window.Dispatcher.dispatch('UPDATE')
        window.Dispatcher.dispatch('CONTROL_UPDATE')
    },

    getInitials(){
        return this.current_user.first_name[0] + this.current_user.last_name[0]
    }

}

const UserManagerSingleton = UserManager;

window.UserManager = UserManagerSingleton // web

export default window.UserManager // this will initialise the singleton instantly