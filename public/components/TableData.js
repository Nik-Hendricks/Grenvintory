class TableData extends HTMLElement{
<<<<<<< HEAD
    constructor(){
=======
    constructor(props){
>>>>>>> 4ffc0ab (work)
        super();
        this.t = document.createElement('table');
        this.th = document.createElement('thead');
        this.tb = document.createElement('tbody');
<<<<<<< HEAD
    }

    connectedCallback(){
        console.log(window.innerWidth - this.offsetWidth / 2 + 'px')
        this.style.marginLeft = window.innerWidth - this.offsetWidth / 2 + 'px';
=======
        this.props = props
    }

    connectedCallback(){
        this.style.width = this.props.width + 'px'
        this.style.height = this.props.height + 'px'
        this.style.display = 'block'
        this.style.overflow = 'scroll'
        this.th.display = 'block'
        this.th.background = 'blue'

>>>>>>> 4ffc0ab (work)
        this.t.append(this.th, this.tb)
        this.append(this.t)
    }


    populate_data(table_name){

        this.clear();
        window.API.get_rows(table_name).then(rows => {
            console.log(rows)
            window.API.get_schema(table_name).then(schema => {
                console.log(schema)
                this.th.append(this.header_row(Object.entries(schema)))
<<<<<<< HEAD
                for(var i = 0; i < 20; i++){
                    this.tb.append(this.empty_row(schema))
=======
                for(var i = 0; i < 200; i++){
                    this.tb.append(this.empty_row(i, schema))
>>>>>>> 4ffc0ab (work)
                }
            })
        })
    }

    clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
    }

<<<<<<< HEAD
    empty_row(schema){
=======
    empty_row(row_num, schema){
>>>>>>> 4ffc0ab (work)
        var row = document.createElement('tr')
        Object.entries(schema).forEach(el => {
            var td = document.createElement('td');
            var inpt = document.createElement('input')
<<<<<<< HEAD
=======
            inpt.setAttribute('id',`${el},${row_num}`)
>>>>>>> 4ffc0ab (work)
            inpt.setAttribute('type', 'text')
            inpt.style.width = '100%'
            td.style.width = `${el[0].length * 16 + 10}px`
            td.append(inpt)
            row.append(td)

            inpt.onchange = (ev) => {
<<<<<<< HEAD
                console.log(ev.target.value)
=======
                if(ev.target.getAttribute('id').split(',')[0] == 'serial_number'){
                    // id looks like {col},{data_type},{row}
                    var e = document.getElementsByTagName('input')
                    console.log(schema)
                    var data = {}
                    var i = 0;
                    for(var input of e){
                        if (input.getAttribute('id').split(',')[2] == ev.target.getAttribute('id').split(',')[2]){
                            data[Object.entries(schema)[i][0]] = input.value;
                            i++
                        }
                    }
                    console.log(data)
                }
>>>>>>> 4ffc0ab (work)
            }
        })
        //row.append()
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
