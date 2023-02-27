import DataCell from '/Components/DataCell.js'

class TableData extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 20;
        this.row_cells = Array(this.row_count).fill([]);
        this.mode = 'data';
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.t = document.createElement('table');
            this.th = document.createElement('thead');
            this.tb = document.createElement('tbody');
    
            this.style.width = '100%'
            this.style.height = 'auto';
            this.style.display = 'block';
            this.style.overflow = 'scroll';
            this.t.style.width = '100%';
            this.t.style.height = '100%';
            this.tb.style.borderRadius = '5px';
    
            this.t.append(this.th, this.tb)
            this.append(this.t)

            this.create_structure()
            return this;
        })
    }


    create_structure(){
        this.full_clear();
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
            console.log(typeof data)
            console.log(el[0])

            var text = (Object.entries(data).length == 0) ? (el[0] == 'by') ? window.UserManager.getInitials() : (el[0] == 'date') ? new Date().toLocaleDateString() : '' : data[el[0]];

            var dc = new DataCell({text: text, type: el[1], row_num: row_num, col: el[0]})
            row.append(dc)

            dc.onchange = (ev) => {
                var d = this.get_row_data(row_num)
                if(!d.error){
                    window.API.set_inventory(d).then(res => {
                        console.log(res)
                    })
                }
            }
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
        console.log(this.row_cells)
        var cells = this.row_cells[row_num].getElementsByTagName('input')
        var ret = {}
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


        //var cells = this.tb.getElementsByTagName('data-cell');
        //for(var i = 0; i < cells.length; i++){
        //    var cell = cells[i];
        //    var inpt = cell.getElementsByTagName('input')[0];
        //    if(inpt.value == '' || inpt.value == null){
        //        return inpt.getAttribute('id').split(',')[2];
        //    }
        //}
        //return null;
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
