class Window extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
       
    }

    create(data){
        this.style.position = 'absolute';
        this.style.top = `${data.y}px`;
        this.style.left = `${data.x}px`;
        this.style.width = `${data.width}px`;
        this.style.height = `${data.height}px`;
        this.style.overflow = 'scroll'
        this.append(data.el)
        return this;
    }
}

window.customElements.define('custom-window', Window);
export default Window;