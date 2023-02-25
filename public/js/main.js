//1-4-23 Nik Hendricks 
import API from '/js/API.js'
import Window from '/components/Window.js'
import TableData from '/components/TableData.js'
import UserTabBar from '/components/UserTabBar.js'
import UserControls from '/components/UserControls.js'
import UserManager from '/js/UserManager.js'


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
            window.UserManager.load().then(users => {
                this.left_view = document.createElement('div');
                this.middle_view = document.createElement('div');
                this.right_view = document.createElement('div');

                this.left_view.style.width = '50%';
                this.left_view.style.float = 'left';
                this.left_view.style.display = 'block';

                this.right_view.style.width = '30%';
                this.right_view.style.float = 'right';
                this.right_view.style.display = 'block';

                this.middle_view.style.width = '20%';
                this.middle_view.style.float = 'left';
                this.middle_view.style.display = 'block';
                this.middle_view.style.height = 'calc(100% - 58px)';


                this.createMainView(users); 
            });        
    }

    createMainView(users){
        this.left_view.append(new TableData({width:500, height: 532}).populate_data('inventory'));
        this.middle_view.append(new UserControls())
        document.getElementById('maincontent').append(new UserTabBar(users), this.left_view, this.middle_view, this.right_view);   
    }

    window(data){
        var w = new Window();
        return w.create(data);
    }
}


var maincontent = document.getElementById('maincontent')
var app = new Grenvintory({maincontent:maincontent, margin:40});
console.log(app)