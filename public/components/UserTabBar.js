export default class UserTabBar extends HTMLElement{
    constructor(users){
        super()
        this.users = users
        this.tabs = [];
        this.populate_tabs();
        this.switchTab(window.UserManager.current_user.username);
    }

    connectedCallback(){
        this.style.width = '100%'
        this.style.height = '35px'
        this.style.background = "#38B289"
        this.style.display = 'block'
        this.style.overflow = 'hidden'
    }

    populate_tabs(){
        this.users.forEach(user => {
            var tab = new Tab(user.username, () => {
                window.UserManager.switchUser(user)
                this.switchTab(user.username);
            })
            this.append(tab)
            this.tabs.push(tab)
        })
    }

    switchTab(tab){
        this.tabs.forEach(_tab => {
            _tab.style.background = 'var(--window-color-1)'
            if(_tab.innerText == tab){
                _tab.style.background = 'var(--window-color-2)'
            }
        })
    }
}

class Tab extends HTMLElement{
    constructor(text, onclick){
        super();
        this.style.width = '100px';
        this.style.height = 'calc(100% - 5px)';
        this.style.float = 'left';
        this.style.background = 'var(--window-color-2)';
        this.style.color = 'white';
        this.style.textAlign = 'center';
        this.style.lineHeight = '40px';
        this.style.cursor = 'pointer';
        this.style.borderTopRightRadius = '5px';
        this.style.borderTopLeftRadius = '5px';
        this.style.marginLeft = '5px';
        this.style.marginTop = '5px';
        this.style.fontSize = '13px';
        this.innerText = text;
        this.onclick = onclick;
    }

    connectedCallback(){

    }
}

window.customElements.define('user-tab', Tab)
window.customElements.define('user-tab-bar', UserTabBar)