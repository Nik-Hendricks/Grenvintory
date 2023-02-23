import Component from '/components/Component.js'

class Window extends Component{
    constructor(props){
        super(props);
        this.props = props;
    }

    connectedCallback(){
        this.x = this.props.x;
        this.y = this.props.y;
        this.width = this.props.width;
        this.height = this.props.height;
        this.append(this.title_bar(), this.props.el)
        this.setup_events();
        this.style({
            background:'blue',
            width: `${this.props.width}px`,
            height: `${this.props.height}px`,
            position:'absolute',
            top:`${this.props.y}px`,
            left: `${this.props.x}px`,
            overflow:'scroll'
        })
        return this;
    }

    title_bar(){
        var el = document.createElement('div');
        
        return el;
    }

    get_corners(x, y, width, height){
        //returns x,y coordinates of all 4 corners starting from the top left going clockwise
        var corner1 = [x, y]
        var corner2 = [x + width, y];
        var corner3 = [x + width, y + height]
        var corner4 = [x, y + height]
        return [corner1, corner2, corner3, corner4]
    }

    setup_events(){
        window.addEventListener('mousemove', (ev) => {
            var x = this.x;
            var y = this.y;
            var width = this.width;
            var height = this.height;
            var size = 20;
            var corner_index = 0;
            document.body.style.cursor = "auto";
            this.get_corners(x, y, width, height).forEach(window_corner => {
                if(ev.clientX >= window_corner[0] - (size / 2) && ev.clientX <= window_corner[0] + (size / 2) ){
                    if(ev.clientY >= window_corner[1]  - (size / 2) && ev.clientY <= window_corner[1] + (size / 2) ){

                        if(corner_index == 0){
                            document.body.style.cursor = "nw-resize";
                        }
                        if(corner_index == 1){
                            document.body.style.cursor = "ne-resize";
                        }
                        if(corner_index == 2){
                            document.body.style.cursor = "se-resize";
                        }
                        if(corner_index == 3){
                            document.body.style.cursor = "sw-resize";
                        }

                        if(this.mouse_state == true){
                        }
                    }
                }
                corner_index++
            })
            
    })
    }
}

window.customElements.define('custom-window', Window);
export default Window;