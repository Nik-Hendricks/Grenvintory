class TableData extends HTMLElement{
    constructor(props){
        super();
        this.t = document.createElement('table');
        this.th = document.createElement('thead');
        this.tb = document.createElement('tbody');
        this.props = props
    }

    connectedCallback(){
        var margin = 10;
        this.style.width = '100%'
        this.style.height = 'auto';
        this.style.display = 'block';
        this.style.overflow = 'scroll';

        this.t.style.width = '100%';
        this.t.style.height = '100%';

        this.t.append(this.th, this.tb)
        this.append(this.t)
        return this;
    }

    populate_data(table_name){
        this.clear();
        window.API.get_rows(table_name).then(rows => {
            window.API.get_schema(table_name).then(schema => {
                this.schema = schema;
                this.th.append(this.header_row(Object.entries(schema)))
                for(var i = 0; i < 20; i++){
                    this.tb.append(this.new_row(i, {}))
                }
            })
        })
        return this;
    }

    clear(){
        Object.entries(this.tb.getElementsByTagName('input')).forEach(el => {
            el[1].value = '';
        })
    }

    submit_row(row_num){
        //here we set timer to wait a while before submitting data to server
        setTimeout(() => {
            // id looks like {col},{data_type},{row}
            var e = this.getElementsByTagName('input')
            var data = {}
            var i = 0;
            for(var input of e){
                var input_row_num = input.getAttribute('id').split(',')[2]
                if (Number(input_row_num) == row_num){
                    data[Object.entries(this.schema)[i][0]] = input.value;
                    console.log(input.value)
                    i++
                }
            }
            window.API.set_inventory(data).then(res => {
                console.log(res)
            })
        }, /*1000 * 60 * 5*/ 0);
    }

    new_row(row_num,  data){
        var row = document.createElement('tr')
        Object.entries(this.schema).forEach(el => {
            var td = document.createElement('td');
            var inpt = document.createElement('input')
            var value = (typeof data[el[0]] !== 'undefined') ? data[el[0]] : ''
            inpt.value = value
            inpt.setAttribute('id',`${el},${row_num}`)
            inpt.setAttribute('type', 'text')
            inpt.style.width = '100%'
            td.append(inpt)
            row.append(td)

            inpt.onchange = (ev) => {
                var col = ev.target.getAttribute('id').split(',')[0]
                if(col == 'serial_number'){
                    this.submit_row(row_num)
                }
            }
        })
        return row;
    }

    append_rows(data){
        this.clear();
        for(var d of data){
            var empty_row  = this.find_next_empty_row();
            var original_row = this.tb.getElementsByTagName('tr')[empty_row]
            original_row.parentNode.replaceChild(this.new_row(empty_row, d), original_row);
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

    find_next_empty_row(){
        var cells = this.tb.getElementsByTagName('td');
        for(var i = 0; i < cells.length; i++){
            var cell = cells[i];
            var inpt = cell.getElementsByTagName('input')[0];
            if(inpt.value == '' || inpt.value == null){
                return inpt.getAttribute('id').split(',')[2];
            }
        }
        return null;
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
