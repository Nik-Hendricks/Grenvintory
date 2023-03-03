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
        this.hasFormulaInput = (typeof props.hasFormulaInput !== 'undefined') ? props.hasFormulaInput: false;
        this.mode = (typeof props.mode !== 'undefined') ? props.mode: 'view';
        console.log(this.mode)
        
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            console.log(schema)
            this.schema = schema;
            this.t = document.createElement('div');
            this.th = document.createElement('div');
            this.tb = document.createElement('div');
            this.detailed_cell = new CustomInput({width: '100%', height: '35px', type: 'text', text: 'Detailed View', icon:'info', margin:'5px'})

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
            if(this.hasFormulaInput){
                this.tb.style.height = 'calc(100% - 85px)';
            }else{
                this.tb.style.height = '100%'
            }



            this.detailed_cell.setAttribute('type', 'text')
    
            this.t.append(this.th, this.tb)
            this.append(this.t)
            if(this.hasFormulaInput){
                this.append(this.detailed_cell)
            }

            this.refresh()
            return this;
        })
    }

    refresh(){
        console.log(this.mode)
        if(this.mode == 'view'){
            this.create_structure()
        }else{
            this.create_structure()
            window.API.get_rows(this.table_name).then(res => {
                this.append_rows(window.API.sort(res, 'date', true));
            })
        }
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
            td.style.width = `calc(100% / ${Object.entries(this.schema).length})`
            td.innerHTML = col[0].split('_').join(' ');
            td.style.color = 'white';
            td.style.fontSize = '12px'
            td.style.fontWeight = 'bold'
            td.style.height = '12px'
            td.style.textTransform = 'capitalize'
            td.style.color = '#38B289'
            td.style.overflow = 'hidden'
            td.style.lineHeight = '12px'
            td.style.marginTop = '5px'
            td.style.marginBottom = '5px'
            row.append(td)
        })
        return row;
    }

}

window.customElements.define('table-data', TableData)
export default TableData;
