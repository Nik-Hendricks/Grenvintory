export default class DataCell extends HTMLElement{
    constructor(props){
        super();
        this.props = (typeof props !== 'undefined') ? props : {};
        this.type = this.props.type;
        this.row_num = this.props.row_num;
        this.col = this.props.col;

        if(this.type === 'string'){
            this.input = document.createElement('input')
            var value = (typeof this.props.text !== 'undefined') ? this.props.text : ''
            this.input.value = value
            this.input.setAttribute('type', 'text')
        }else if(this.type === 'number'){
            this.input = document.createElement('input')
            var value = (typeof this.props.text !== 'undefined') ? this.props.text : ''
            this.input.value = value
            this.input.setAttribute('type', 'text')
        }else if(this.type === 'serial_number'){
            this.input = document.createElement('input')
            var value = (typeof this.props.text !== 'undefined') ? this.props.text : ''
            this.input.value = value
            this.input.setAttribute('type', 'text')
        }

        

        this.append(this.input)
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