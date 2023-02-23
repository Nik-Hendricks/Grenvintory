export default class UserTabBar extends HTMLElement{
    constructor(){
        super()
    }

    connectedCallback(){
        this.style.width = '100%'
        this.style.height = '40px'
        this.style.background = "blue"
        this.style.display = 'block'
    }
}

window.customElements.define('user-tab-bar', UserTabBar)