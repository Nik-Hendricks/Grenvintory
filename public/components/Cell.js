import Component from '/components/Component.js';

export default class Cell extends HTMLElement{
    constructor(props){
        super()
        this.props = (typeof props !== 'undefined') ? props : {};
        this.type = this.props.type;
        this.row = this.props.row;
        this.col = this.props.col;
        this.value = (typeof this.props.text !== 'undefined') ? this.props.text : '';
        this.locked = (this.col == 'date' || this.col == 'by') ? true : false;
        this.serialized = (this.col == 'serial_number') ? true : false;
        return this;
    }

    CreateStructure(){
        this.input = document.createElement('input');
        this.input.value = this.value;
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('id', `${this.type},${this.col},${this.row.row_num}`);
        
    }

    PreStyle(){
        this.style.display = 'inline-block';
        this.style.margin = '0';
        this.style.padding = '0';
        this.style.width = `calc(100% / ${window.app.admin_mode ? 10 : 8})`

        this.input.style.width = 'calc(100% - 5px)';
        this.input.style.height = '100%';
        this.input.style.border = 'none';
        this.input.style.padding = '0';
        this.input.style.margin = '2.5px';
        this.input.style.display = 'block';
        this.input.style.boxSizing = 'border-box';
        this.input.style.borderRadius = '5px'
        this.input.style.height = '25px'
    }

    SetupEvents(){
        this.input.addEventListener('focus', (focus_ev) => {
            this.row.table.current_cell = this;
            this.row.table.detailed_cell.value = focus_ev.target.value;
      
            if(this.locked){
                focus_ev.preventDefault();
                this.Focus();
            }else if (this.serialized && this.row.table.current_quantity > 1){
                //if(this.input.value.toLowerCase() !== 'n/a'){
                //    this.row.table.detailed_cell.focus();
                //}
            }
        });

        this.input.addEventListener('keypress', (key_ev) => {
            //set tables current row quantity if the current cell is the quantity cell
            if (this.col == 'quantity') {
                this.row.current_quantity = this.input.value;
            }
            if (this.serialized && this.row.current_quantity > 1){
                if (key_ev.keyCode == 9 || key_ev.keyCode == 13){
                    console.log(this.input.value.split(',').length)
                    if(this.input.value.split(',').length < this.row.current_quantity){
                        key_ev.preventDefault();
                        this.input.value = this.input.value + ", "
                    }else{
                        key_ev.preventDefault();
                        this.Focus();
                    }
                }
            }
            setTimeout(() => {
                this.row.table.detailed_cell.value = this.input.value;
            }, 30);
        });

        this.input.addEventListener('change', (change_ev) => {
            var d = this.row.GetRowValue()
            if (!d.error) {
                d._id = this.row._id;
                window.API.set_inventory(d).then(res => {
                    if(res._id !== undefined){
                        this.row._id = res._id;
                    }
                });
            }
        })
    }

    Focus(){
        if(this.nextElementSibling){
            this.nextElementSibling.input.focus();
        }else{
            this.row.table.rows[this.row.row_num + 1].cells[0].input.focus()
        }
    }

    connectedCallback(){
        this.CreateStructure()
        this.PreStyle();
        this.append(this.input)
        this.SetupEvents();
    }
}

window.customElements.define('cell-component', Cell);