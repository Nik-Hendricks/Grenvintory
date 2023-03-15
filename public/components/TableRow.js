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
        this.setAttribute('id', this._id);
        this.cells = [];
        return this;
    }

    connectedCallback(){
        this.preStyle();
        this.create_structure();
        this.addEventListener("mouseover", (event) => {
            if(this.table.delete_mode !== 'false' && this.table.mode == 'view' && window.UserManager.current_user.permission_level > 0){
                this.hightlight_cells('var(--red)');
            }
        })

        this.addEventListener("mouseout", (event) => {
            this.hightlight_cells('white');
        })

        this.onclick = () => {
            if(this.table.delete_mode !== 'false' && this.table.mode == 'view' && window.UserManager.current_user.permission_level > 0){
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
            //LONG ternary operater
            if(el[0] == 'date' || el[0] == 'posted_date'){
                var d = (this.data[el[0]] !== undefined) ? new Date(this.data[el[0]]) : new Date()
                var formated_date = ((d.getMonth() > 8) ? (d.getMonth() + 1) : ('0' + (d.getMonth() + 1))) + '/' + ((d.getDate() > 9) ? d.getDate() : ('0' + d.getDate())) + '/' + d.getFullYear()    
                var text = formated_date;
            }else if(el[0] == 'by'){

                var text = (this.data[el[0]] !== undefined) ? this.data[el[0]] :  window.UserManager.getInitials()
            }else{
                var text = (this.data[el[0]] !== undefined) ? this.data[el[0]] : ''
            }
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
                if(res.success){
                    this.remove();
                    return {success: true};
                }else{
                    return {error: 'failed to delete'};
                }
            })
        }else{
            return {error: 'no id'};
        }
    }
}

window.customElements.define('table-row', TableRow);