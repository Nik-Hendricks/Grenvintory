import Component from '/components/Component.js';
import Cell from '/components/Cell.js'

export default class TableRow extends Component{
    constructor(props){
        super();
        this.props = props;
        this.table = props.table;
        this.row_num = typeof props.row_num !== 'undefined' ? props.row_num : null;
        this.data = typeof props.data !== 'undefined' ? props.data : null;
        this.current_quantity = 0;
        this._id = typeof this.data._id !== 'undefined' ? this.data._id : null;
        this.cells = [];
        return this;
    }

    connectedCallback(){
        this.preStyle();
        this.create_structure();
        this.addEventListener("mouseover", (event) => {
            if(this.table.mode == 'delete'){
                this.hightlight_cells('var(--red)');
            }
        })

        this.addEventListener("mouseout", (event) => {
            if(this.table.mode == 'delete'){
                this.hightlight_cells('white');
            }
        })

        this.onclick = () => {
            if(this.table.mode == 'delete'){
                this.DeleteRow();
            }
        }
    }

    hightlight_cells(color){
        for(var el of this.getElementsByTagName('input')){
            el.style.background = color;
        }
    }

    create_structure(){
        Object.entries(this.table.schema).forEach(el => {
            var text = (Object.entries(this.data).length == 0) ? (el[0] == 'by') ? window.UserManager.getInitials() : (el[0] == 'date') ? new Date().toLocaleDateString() : '' : this.data[el[0]];
            var dc = new Cell({row: this, text: text, type: el[1], col: el[0]})
            this.append(dc)
            this.cells.push(dc);
            this.table.row_cells[this.row_num] = dc;
            this.cells.push[this.row_num] = dc;
        })
    }

    preStyle(){
        this.style.width = "100%";
        this.style.display = 'block';
    }

    GetRowValue(){
        var cells = this.getElementsByTagName('input')
        var ret = {}
        for(var cell of cells){
            if(cell.value == '' || cell.value == null || cell.value == undefined || typeof cell.value == 'undefined'){
                if(this._id !== 'undefined' && this._id !== null){
                    ret[cell.getAttribute('id').split(',')[1]] = cell.value;
                }else{
                    return {error: 'empty cell'};
                }
            }
            ret[cell.getAttribute('id').split(',')[1]] = cell.value;
        }
        return ret;
    }

    DeleteRow(){
        if(this._id !== null){
            window.API.DeleteRow({table_name: this.table.table_name, _id: this._id}).then(res => {
                console.log(res)
                return {success: true};
            })
        }else{
            return {error: 'no id'};
        }
    }
}

window.customElements.define('table-row', TableRow);