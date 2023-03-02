export default class DataCell extends HTMLElement {
    constructor(props) {
      super();
      this.props = (typeof props !== 'undefined') ? props : {};
      this.type = this.props.type;
      this.row_num = this.props.row_num;
      this.col = this.props.col;
      this.row = this.props.row;
  
      this.input = document.createElement('input');
      var value = (typeof this.props.text !== 'undefined') ? this.props.text : '';
      this.input.value = value;
      this.input.setAttribute('type', 'text');
      this.input.setAttribute('id', `${this.type},${this.col},${this.row_num}`);
      this.input.style.width = 'calc(100% - 5px)';
      this.input.style.height = '100%';
      this.input.style.border = 'none';
      this.input.style.padding = '0';
      this.input.style.margin = '2.5px';
      this.input.style.display = 'block';
      this.input.style.boxSizing = 'border-box';
      this.input.style.borderRadius = '5px'
      this.input.style.height = '25px'
  
      this.appendChild(this.input);
  
      this.input.addEventListener('change', (ev) => {
        var d = this.GetRowValue()
        if (!d.error) {
          if(this.row.hasAttribute('data-id')){
            d._id = this.row.getAttribute('data-id');
            window.API.set_inventory(d).then(res => {
              this.row.setAttribute('data-id', res._id);
            });
          }else{
            window.API.set_inventory(d).then(res => {
              this.row.setAttribute('data-id', res._id);
            });
          }
        }
      });
  
      this.input.addEventListener('focus', (ev) => {
        this.row.table.current_cell = this;
        this.row.table.detailed_cell.value = ev.target.value;
  
        if (this.col == 'by') {
          ev.preventDefault();
          this.nextElementSibling.input.focus();
        } else if (this.col == 'date') {
          ev.preventDefault();
          if (window.app.admin_mode) {
            this.nextElementSibling.input.focus();
          } else {
            this.row.table.rows[this.row_num + 1].cells[0].input.focus()
          }
  
        } else if (this.col == 'serial_number') {
          if (this.row.table.current_quantity > 1) {
            this.row.table.detailed_cell.focus();
          }
        }
  
        this.input.addEventListener('keydown', (ev) => {
          this.row.table.detailed_cell.value = this.input.value;
          //set tables current row quantity if the current cell is the quantity cell
          if (this.col == 'quantity') {
            this.row.table.current_quantity = this.input.value;
          }
        });
      });
    }
  
    connectedCallback() {
      this.style.display = 'table-cell';
      this.style.margin = '0';
      this.style.padding = '0';
      this.style.height = '100%';
      //this.style.float = 'left';
    }

    GetRowValue(){
      var cells = this.row.table.rows[this.row_num].getElementsByTagName('input')
      console.log(cells)
      var ret = {}
      for(var cell of cells){
          if(cell.value == '' || cell.value == null || cell.value == undefined || typeof cell.value == 'undefined'){
              return {error: 'empty cell'};
          }
          ret[cell.getAttribute('id').split(',')[1]] = cell.value;
      }
      return ret;
    }
  }
  
  window.customElements.define('data-cell', DataCell);