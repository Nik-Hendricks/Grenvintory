import DataCell from '/components/DataCell.js'
import CustomInput from '/components/CustomInput.js'

class TableData extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 20;
        this.row_cells = Array(this.row_count).fill([]);
        this.row = 0;
        this.col = 0;
        this.current_cell = null;
        this.mode = 'data';
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.t = document.createElement('table');
            this.th = document.createElement('thead');
            this.tb = document.createElement('tbody');
            this.detailed_cell = new CustomInput({width: '100%', height: '35px', type: 'text', text: 'Detailed View', icon:'info', margin:'5px'})

            this.detailed_cell.addEventListener('input', (ev) => {
                this.current_cell.input.value = ev.target.value;
            })
    
            this.style.width = '100%'
            this.style.height = 'auto';
            this.style.display = 'block';
            this.style.overflow = 'scroll';
            this.t.style.width = 'calc(100% - 10px)';
            this.t.style.height = 'calc(100% - 30px)';
            this.t.style.margin = '5px';
            this.tb.style.borderRadius = '5px !important';
            this.tb.style.overflow = 'hidden';

            this.detailed_cell.setAttribute('type', 'text')
    
            this.t.append(this.th, this.tb)
            this.append(this.t, this.detailed_cell)

            this.create_structure()
            return this;
        })
    }


    create_structure(){
        this.full_clear();
        this.t.append(this.th, this.tb)
        this.th.append(this.header_row(Object.entries(this.schema)))
        for(var i = 0; i < this.row_count; i++){
            var r = this.new_row(i, {});
            this.tb.append(r)
        }
    
        return this;
    }

    full_clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
    }

    clear(){
        Object.entries(this.tb.getElementsByTagName('input')).forEach(el => {
            el[1].value = '';
        })
    }


    new_row(row_num,  data){
        var row = document.createElement('tr')
        row.style.display = 'table-row';
        row.style.height = '22px !important';
        Object.entries(this.schema).forEach(el => {
            var text = (Object.entries(data).length == 0) ? (el[0] == 'by') ? window.UserManager.getInitials() : (el[0] == 'date') ? new Date().toLocaleDateString() : '' : data[el[0]];
            var dc = new DataCell({table: this, text: text, type: el[1], row_num: row_num, col: el[0]})

            row.append(dc)
        })
        this.row_cells[row_num] = row;
        return row;
    }

    append_rows(data){
        this.clear();
        for(var d of data){
            var empty_row  = this.find_next_empty_row();
            console.log(empty_row)
            var original_row = this.row_cells[empty_row]
            console.log(original_row)
            original_row.parentNode.replaceChild(this.new_row(empty_row, d), original_row);
            this.row_cells
        }
    }

    header_row(cols){
        var row = document.createElement('tr');
        cols.forEach(col => {
            var td = document.createElement('th');
            td.innerHTML = col[0];
            td.style.color = 'white';
            row.append(td)
        })
        return row;
    }

    populated_row(data){
        var row = document.createElement('tr');
        Object.entries(data).forEach(el => {
            var td = document.createElement('td');
            td.innerHTML = el[1];
            row.append(td)
        })
        return row;
    }


    get_row_data(row_num){
        var cells = this.row_cells[row_num].getElementsByTagName('input')
        var ret = {}
        var quantity = 0;
        for(var cell of cells){
            console.log(quantity)
            console.log(cell.getAttribute('id').split(',')[1])
            if(cell.value == '' || cell.value == null || cell.value == undefined || typeof cell.value == 'undefined'){
                return {error: 'empty cell'};
            }

            if(cell.getAttribute('id').split(',')[1] == 'quantity'){
                quantity = cell.value;
            }

            if(cell.getAttribute('id').split(',')[1] == 'serial_number'){
                if(quantity > 0){
                    console.log('stay')

                }
            }


            ret[cell.getAttribute('id').split(',')[1]] = cell.value;
        }
        return ret;
    }

    find_next_empty_row(){
        for(var row in this.row_cells){
            if(this.get_row_data(row).error){
                return row;
            }
        }
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
