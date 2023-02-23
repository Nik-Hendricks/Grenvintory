class TableData extends HTMLElement{
    constructor(props){
        super();
        this.t = document.createElement('table');
        this.th = document.createElement('thead');
        this.tb = document.createElement('tbody');
        this.props = props
    }

    connectedCallback(){
        this.style.width = this.props.width + 'px'
        this.style.height = this.props.height + 'px'

 

        this.t.append(this.th, this.tb)
        this.append(this.t)
    }


    populate_data(table_name){
        this.clear();
        window.API.get_rows(table_name).then(rows => {
            window.API.get_schema(table_name).then(schema => {
                this.th.append(this.header_row(Object.entries(schema)))
                for(var i = 0; i < 200; i++){
                    this.tb.append(this.empty_row(i, schema))
                }
            })
        })
    }

    clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
    }

    empty_row(row_num, schema){
        var row = document.createElement('tr')
        Object.entries(schema).forEach(el => {
            var td = document.createElement('td');
            var inpt = document.createElement('input')
            inpt.setAttribute('id',`${el},${row_num}`)
            inpt.setAttribute('type', 'text')
            inpt.style.width = '100%'
            td.style.width = `${el[0].length * 16 + 10}px`
            td.append(inpt)
            row.append(td)

            inpt.onchange = (ev) => {
                console.log(ev.target.value)
                if(ev.target.getAttribute('id').split(',')[0] == 'serial_number'){
                    // id looks like {col},{data_type},{row}
                    var e = document.getElementsByTagName('input')
                    var data = {}
                    var i = 0;
                    for(var input of e){
                        if (input.getAttribute('id').split(',')[2] == ev.target.getAttribute('id').split(',')[2]){
                            data[Object.entries(schema)[i][0]] = input.value;
                            i++
                        }
                    }
                    window.API.set_row('inventory', data).then(res => {
                        console.log(res)
                    })
                }
            }
        })
        return row;
    }

    header_row(cols){
        var row = document.createElement('tr');
        cols.forEach(col => {
            console.log(col)
            var td = document.createElement('th');
            td.innerHTML = col[0];
            row.append(td)
        })
        return row;
    }

    new_row(shema, row){
        var row = document.createElement('tr');
        
        return row;
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
