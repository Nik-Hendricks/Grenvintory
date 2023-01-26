class TableData extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.t = document.createElement('table')
        this.th = document.createElement('thead');
        this.tb = document.createElement('tbody')
        this.t.append(this.th, this.tb)
        this.append(this.t)
    }


    populate_data(table_name){
        console.log('asd')
        window.API.get_rows(table_name).then(rows => {
            window.API.get_schema(table_name).then(schema => {
                for(var i = 0; i < 100; i++){
                    this.tb.append(this.empty_row(schema))
                }
            })
        })
    }

    empty_row(schema){
        var row = document.createElement('tr')
        Object.entries(schema).forEach(el => {
            var td = document.createElement('td');
            var inpt = document.createElement('input')
            inpt.setAttribute('type', 'text')
            inpt.style.width = '100%'
            td.style.width = `${el[0].length * 16 + 10}px`
            td.append(inpt)
            row.append(td)
        })
        //row.append()
        return row;
    }

    new_row(shema, row){
        var row = document.createElement('tr');
        
        return row;
    }
}

window.customElements.define('table-data', TableData)
export default TableData;
