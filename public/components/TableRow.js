import Component from '/components/Component.js';
import DataCell from '/components/DataCell.js';


export default class TableRow extends Component{
    constructor(props){
        super();
        this.props = props;
        this.table = props.table;
        this.row_num = typeof props.row_num !== 'undefined' ? props.row_num : null;
        this.data = typeof props.data !== 'undefined' ? props.data : null;
        this.id = typeof props.id !== 'undefined' ? props.id : null;
        this.cells = [];
        return this;
    }

    connectedCallback(){
        this.preStyle();
        this.create_structure();
    }

    create_structure(){
        Object.entries(this.table.schema).forEach(el => {
            var text = (Object.entries(this.data).length == 0) ? (el[0] == 'by') ? window.UserManager.getInitials() : (el[0] == 'date') ? new Date().toLocaleDateString() : '' : this.data[el[0]];
            var dc = new DataCell({table: this.table, text: text, type: el[1], row_num: this.row_num, col: el[0]})
            this.append(dc)
            this.cells.push(dc);
            this.table.row_cells[this.row_num] = dc;
            this.cells.push[this.row_num] = dc;
        })
    }

    preStyle(){
        this.style.width = "100%";
        this.style.display = 'table-row';

    }
}

window.customElements.define('table-row', TableRow);