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
        this.style.height = this.props.height + 'px';
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
                this.th.append(this.header_row(Object.entries(schema)))
                for(var i = 0; i < 20; i++){
                    this.tb.append(this.empty_row(i, schema))
                }
            })
        })
        return this;
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
                this.submit_row(ev, schema, row_num)
            }
        })
        return row;
    }

    submit_row(ev, schema, row_num){
        var col = ev.target.getAttribute('id').split(',')[0]
        if(col == 'serial_number'){
            //here we set timer to wait a while before submitting data to server
            setTimeout(() => {
                // id looks like {col},{data_type},{row}
                var e = this.getElementsByTagName('input')
                var data = {}
                var i = 0;
                for(var input of e){
                    var input_row_num = input.getAttribute('id').split(',')[2]
                    if (Number(input_row_num) == row_num){
                        data[Object.entries(schema)[i][0]] = input.value;
                        console.log(input.value)
                        i++
                    }
                }

                window.API.set_row(window.UserManager.current_user, 'inventory', data).then(res => {
                    console.log(res)
                })
            }, /*1000 * 60 * 5*/ 0);
        }
    }

    data_to_row(data){
        var row = document.createElement('tr');
        Object.entries(data).forEach(el => {
            var td = document.createElement('td');
            td.innerHTML = el[1];
            row.append(td)
        })
        return row;
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

    new_row(shema, row){
        var row = document.createElement('tr');
        
        return row;
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
