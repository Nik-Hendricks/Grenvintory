import Component from './Component.js';

export default class Container extends Component{
    constructor(props){
        super();
        this.id = props.id
    }

}

window.customElements.define('container-el', Container)