import CustomInput from '/components/CustomInput.js'
import TableRow from '/components/TableRow.js'

class Table extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 100;
        this.row = 0;
        this.col = 0;
        this.current_cell = null;
        this.hasFormulaInput = (typeof props.hasFormulaInput !== 'undefined') ? props.hasFormulaInput: false;
        this.mode = (typeof props.mode !== 'undefined') ? props.mode: 'add';
        this.delete_mode = 'false';
        this.page = 0;
        this.direction = (typeof props.direction !== 'undefined') ? props.direction: 'up';
        this.RowManager = new RowManager(this);
        this.ScrollManager = new ScrollManager(this);
        this.Count().then(count => {
            this.count = count.count;
        })
    }

    PreStyle(){
        this.style.width = '100%'
        this.style.height = '100%'
        this.style.overflow = 'none';
        this.t.style.overflow = 'scroll'
        this.t.style.width = 'calc(100% - 10px)';
        this.t.style.margin = '5px';

        this.tb.style.borderRadius = '5px';
        this.tb.style.overflow = 'scroll';
        this.tb.style.position = 'relative';
        this.tb.style.top = '0px'
        this.tb.style.bottom = '0px'

        if(this.hasFormulaInput || this.hasInputRow){
            this.tb.style.height = 'calc(100% - 85px)';
        }else{
            this.tb.style.height = '100%'
        }

    }

    CreateStructure(){
        this.t = document.createElement('div');
        this.th = document.createElement('div');
        this.tb = document.createElement('div');
        this.detailed_cell = new CustomInput({width: '100%', height: '35px', type: 'text', text: 'Detailed View', icon:'info', margin:'5px'})
        this.detailed_cell.setAttribute('type', 'text')
        this.t.append(this.th, this.tb)
        this.append(this.t)
        if(this.hasFormulaInput){
            this.append(this.detailed_cell)
        }
    }

    Count(){
        return new Promise(resolve => {
            window.API.Count(this.table_name).then(count => {
                resolve(count)
            })
        })
    }

    EditView(){
        this.full_clear();
        for(var i = 0; i < this.row_count; i++){
            var r = this.RowManager.new_row(i, {});
            this.tb.getElementsByTagName('div')[0].append(r)
        }
    }

    ViewView(){
        this.full_clear();
        if(window.UserManager.current_user.permission_level == 1){ // if admin
            this.current_query = {} // get all
            this.Query(this.current_query).then(res => {
                this.prepend_rows(res);
                if(this.direction == 'up'){
                    this.tb.scrollTop = this.tb.scrollHeight;
                }
            })
        }else{
            this.current_query = {by:window.UserManager.getInitials()}
            this.Query(this.current_query).then(res => {
                this.prepend_rows(res);
                if(this.direction == 'up'){
                    this.tb.scrollTop = this.tb.scrollHeight;
                }
            })
        }
    }

    HybridView(){
        this.full_clear();
        this.current_query = {}
        this.Query(this.current_query).then(res => {
            this.append_rows(res);
        })
    }

    refresh(a){
        this.ScrollManager.page = 0;
        window.API.get_schema(this.table_name, window.app.admin_mode).then(schema => {
            this.schema = schema;
            setTimeout(() => {
                if(this.mode == 'view'){
                    this.ViewView();
                    this.ScrollManager.init();
                }else if(this.mode == 'add'){
                    this.EditView();
                }else if(this.mode == 'hybrid'){
                    
                }
            }, 100)
        })
    }

    full_clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
        this.tb.append(document.createElement('div'))
        this.t.append(this.th, this.tb)
        this.th.append(this.header_row(Object.entries(this.schema)))
        this.RowManager.rows = [];
    }


    append_rows(data){
        for(var d of data){
            var c = this.RowManager.rows.length + 1
            var new_row = this.RowManager.new_row(c, d)
            this.tb.getElementsByTagName('div')[0].append(new_row)
        }
    }

    prepend_rows(data){
        for(var d of data){
            var c = this.RowManager.rows.length + 1
            var new_row = this.RowManager.new_row(-1, d)
            this.tb.getElementsByTagName('div')[0].prepend(new_row)
        }
    }

    header_row(cols){
        var row = document.createElement('div');
        cols.forEach(col => {
            var td = document.createElement('p');
            td.style.display = 'inline-block'
            td.style.textAlign = 'center'
            td.style.margin = '0'
            td.style.width = `calc(100% / ${Object.entries(this.schema).length})`
            td.innerHTML = col[0].split('_').join(' ');
            td.style.color = 'white';
            td.style.fontSize = '12px'
            td.style.fontWeight = 'bold'
            td.style.height = '12px'
            td.style.textTransform = 'capitalize'
            td.style.color = '#38B289'
            td.style.overflow = 'hidden'
            td.style.lineHeight = '12px'
            td.style.marginTop = '5px'
            td.style.marginBottom = '5px'
            row.append(td)
        })
        return row;
    }



    Query(query){
        return new Promise(resolve => {
            window.API.Query({page: this.ScrollManager.page, table_name:this.table_name, query:query}).then(res => {
                //resolve(API.Sort(res, 'date', true));
                resolve(res)
            })
        })
    }

    connectedCallback(){
        this.innerHTML = '';
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.CreateStructure()
            this.PreStyle();
            return this;
        })
    }

}

class ScrollManager{
    constructor(table){
        this.table = table;
        this.page = 0;
    }

    init(){
        this.table.tb.onscroll = (ev) => {
            if(this.table.direction == 'down'){
                if (this.table.tb.scrollTop + this.table.tb.clientHeight >= this.table.tb.scrollHeight) {
                    console.log('down')
                    this.page += 1;
                    this.table.Query(this.table.current_query).then(res => {
                        this.table.append_rows(res);
                    })
                }
            } else if(this.table.direction == 'up'){
                if (this.table.tb.scrollTop == 0) {
                    this.page += 1;
                    const prevScrollHeight = this.table.tb.scrollHeight; // store current scroll height
                    this.table.Query(this.table.current_query).then(res => {
                        this.table.prepend_rows(res);
                        const newScrollHeight = this.table.tb.scrollHeight; // calculate new scroll height
                        const addedHeight = newScrollHeight - prevScrollHeight; // calculate added height
                        this.table.tb.scrollTop += addedHeight; // adjust scroll position
                    })
                }
            }
        }
    }
}

class RowManager{
    constructor(Table){
        this.rows = []; //loaded rows
        this.row_count = 0; //number of rows
        this.table = Table;
    }

    Rows(){
        return this.rows;
    }

    SetRows(rows){
        this.rows = rows;
    }

    AppendRows(rows){
        this.rows = [...this.rows, ...rows]
    }

    new_row(row_num, data){
        var row = new TableRow({table: this.table, row_num: row_num, data: data});
        if(this.table.direction == 'up'){
            this.rows.unshift(row);
        }else{
            this.rows.push(row);
        }
        this.row_count += 1;
        return row;
    }
}

window.customElements.define('table-data', Table)
export default Table;
