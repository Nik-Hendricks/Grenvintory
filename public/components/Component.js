
class Component extends HTMLElement{
    constructor(props){
        super(props);
        this.props = props;
    }

    style(styles){
        console.log(styles);
        if(typeof styles == 'object'){
            for(var key in styles){
                this.style[key] = styles[key]
            }
        }
        return this;
    }
}

export default Component;