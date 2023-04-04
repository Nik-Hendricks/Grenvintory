import Component from './Component.js';

export default class Text extends Component{
    constructor(props){
        super();
        this.text = props.text;
        this.width = props.width;
        this.CreateStructure();
    }

    CreateStructure(){
        this.innerHTML = this.text;
    }

    Style(){
        this.style.color = "white";
        this.style.fontSize = '16px';
        this.style.lineHeight = '35px';
        this.style.margin = '0px';
        this.style.padding = '0px';
        this.style.verticalAlign = 'middle';
        this.style.width = this.width;
        this.style.float = 'left';
        this.style.textAlign = 'center';

    }

    connectedCallback(){
        this.CreateStructure();
        this.Style();
    }
}

window.customElements.define('text-el', Text)