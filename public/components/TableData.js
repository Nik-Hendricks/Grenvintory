import DataCell from '/components/DataCell.js'
import CustomInput from '/components/CustomInput.js'
import TableRow from '/components/TableRow.js'

class TableData extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 100;
        this.row_cells = Array(this.row_count).fill([]);
        this.rows = []
        this.row = 0;
        this.col = 0;
        this.current_cell = null;
        this.current_quantity = 0;
        this.mode = 'data';
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.t = document.createElement('div');
            this.th = document.createElement('div');
            this.tb = document.createElement('div');
            this.detailed_cell = new CustomInput({width: '100%', height: '35px', type: 'text', text: 'Detailed View', icon:'info', margin:'5px'})

            this.detailed_cell.addEventListener('keydown', (ev) => {
                this.current_cell.input.value = ev.target.value;
                if (ev.keyCode == 9 || ev.keyCode == 13){
                    if(this.detailed_cell.value.toLowerCase() == 'n/a'){
                        ev.preventDefault();
                        this.current_cell.nextElementSibling.input.focus();
                    }else if(this.detailed_cell.value.split(',').length < this.current_quantity){
                        ev.preventDefault();
                        this.detailed_cell.value = this.detailed_cell.value + ", "
                        this.detailed_cell.putCursorAtEnd()
                    }else{
                        ev.preventDefault();
                        this.current_cell.nextElementSibling.input.focus();
                    }
                } 
                
            })

            this.style.width = '100%'
            this.style.height = '100%'
            this.style.overflow = 'none';

            this.t.style.overflow = 'scroll'
            this.t.style.width = 'calc(100% - 10px)';
            this.t.style.margin = '5px';

            
            this.tb.style.borderRadius = '5px';
            this.tb.style.overflow = 'scroll';
            this.tb.style.position = 'relative';
            this.tb.style.top = '0px'
            this.tb.style.height = 'calc(100% - 85px)';



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
        this.rows = [];
    }

    clear(){
        this.tb.innerHTML = '';
        this.rows = [];
    }

    new_row(row_num, data){
        var row = new TableRow({table: this, row_num: row_num, data: data});
        this.rows[row_num] = row;
        return row
    }

    append_rows(data){
        this.clear();
        var row_count = 0;
        for(var d of data){
            var new_row = this.new_row(row_count, d)
            this.rows[row_count] = new_row
            this.tb.append(new_row)
            row_count++;
        }
    }

    header_row(cols){
        var row = document.createElement('div');
        cols.forEach(col => {
            var td = document.createElement('p');
            td.style.display = 'inline-block'
            td.style.textAlign = 'center'
            td.style.margin = '0'
            td.style.width = `calc(100% / ${window.app.admin_mode ? 10 : 8})`
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
            if(cell.value == '' || cell.value == null || cell.value == undefined || typeof cell.value == 'undefined'){
                return {error: 'empty cell'};
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
