
export default class Component extends HTMLElement{
    constructor(props){
        super(props);
        this.props = props;
        return this
    }

    connectedCallback(){
        return this;
    }

    style(styles){
        console.log(styles);
        if(typeof styles == 'object'){
            for(var key in styles){
                console.log(key, styles[key])
                this.style[key] = styles[key]
            }
            return this;
        }
    }
}
;