export default class DataCell extends HTMLElement{
    constructor(props){
        super();
        this.props = (typeof props !== 'undefined') ? props : {};
        this.type = this.props.type;
        this.row_num = this.props.row_num;
        this.col = this.props.col;
        this.table = props.table;

        this.input = document.createElement('input')
        var value = (typeof this.props.text !== 'undefined') ? this.props.text : ''
        this.input.value = value
        this.input.setAttribute('type', 'text')

        

        this.append(this.input)



        this.input.addEventListener('focus', (ev) => {
            console.log('focus')
            this.table.current_cell = this;
            this.table.detailed_cell.value = this.input.value;
            this.input.addEventListener('keydown', (ev) => {
                this.table.detailed_cell.value = this.input.value;
                console.log(this.col)
                if(this.col == 'quantity'){
                    this.table.current_quantity = this.input.value;
                }

                if(this.col == 'serial_number'){
                    if(this.table.current_quantity > 1){
                        this.table.detailed_cell.focus();
                    }
                }


                var d = this.table.get_row_data(this.row_num)
                if(!d.error){
                    window.API.set_inventory(d).then(res => {
                        console.log(res)
                    })
                }
                console.log(this.table.current_quantity)
            })
        })

    }

    connectedCallback(){
        this.style.display = 'table-cell'
        this.style.margin = '0px';
        this.style.height = '22px !important';
        this.input.setAttribute('id',`${this.type},${this.col},${this.row_num}`)
        this.input.style.height = '100%';
        this.input.style.width = '100%'
        this.input.style.display = 'table-cell !important'
    }




}

window.customElements.define('data-cell', DataCell)