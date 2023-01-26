//1-4-23 Nik Hendricks 
import API from '/js/API.js'
import Window from '/components/Window.js'
import TableData from '/components/TableData.js'

class DataCell extends HTMLElement{
    constructor(props){
        super();
        this.props = (typeof props !== 'undefined') ? props : {};
        this.row = this.props.row;
        this.col = this.props.col;
        window.API.get_data(this.row, this.col).then(res => {
            this.data = res;
            console.log(res)
        })
        
    }

    connectedCallback(){
        this.append(this.createInput()); 
    }

    createInput(){
        this.input = document.createElement('input')
        this.input.setAttribute('row', this.row);
        this.input.setAttribute('col', this.col);
        this.input.setAttribute('data', this.data);  
        this.input.setAttribute('type', 'text');
        this.input.style.width = '100%'
        this.input.style.margin = '0px'
        this.input.style.background = 'transparent';
        this.input.style.border = 'none';
        this.input.style.color = 'white'

        //get data then set data attr
        this.input.addEventListener("change", (ev) => {
            var row = ev.target.parentElement.parentElement.getAttribute('row_id')
            var row_num = ev.target.parentElement.parentElement.getAttribute('row_num')
            window.API.set_data(this.row, this.col, ev.target.value);
        });

        return this.input;
    }
}

window.customElements.define('data-cell', DataCell);

class Grenvintory{
    constructor(props){
        this.init(props);
    }

    init(props){
        var props = (typeof props !== 'undefined') ? props : {}; 
        this.margin = (typeof props.margin !== 'undefined') ? props.margin : 20;
        this.maincontent = (typeof props.maincontent !== 'undefined') ? props.maincontent : document.getElementById('maincontent');
        this.cols = ['to', 'from', 'quantity', 'item name', 'serial number', 'reason'];
        this.createMainView(); 
    }

    createMainView(){
        this.maincontent.style.position = 'absolute'
        this.maincontent.style.background = '#212432'
        this.maincontent.style.top = '0px';
        this.maincontent.style.left = '0px';
        this.maincontent.style.right = '0px'
        this.maincontent.style.bottom = '0px'
        this.maincontent.style.width = '100%'
        this.maincontent.style.height = '100%'
        this.maincontent.style.overflow = 'scroll'
        
        var table_data = new TableData();
        table_data.populate_data('inventory')
        var w = 600
        var x = (document.body.clientWidth / 2) - (w / 2);
        console.log(w)
        this.maincontent.append(this.window({x:x, y: 20, width: w, height: 500, el: table_data}))

    }

    window(data){
        var w = new Window();
        return w.create(data);
    }


}


var maincontent = document.getElementById('maincontent')
var app = new Grenvintory({maincontent:maincontent, margin:40});
console.log(app)