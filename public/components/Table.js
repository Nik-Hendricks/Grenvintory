import CustomInput from '/components/CustomInput.js'
import TableRow from '/components/TableRow.js'

class Table extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 100;
        this.row_cells = Array(this.row_count).fill([]);
        this.row = 0;
        this.col = 0;
        this.current_cell = null;
        this.hasFormulaInput = (typeof props.hasFormulaInput !== 'undefined') ? props.hasFormulaInput: false;
        this.mode = (typeof props.mode !== 'undefined') ? props.mode: 'add';
        this.delete_mode = 'false';
        this.skip = 0;
        this.limit = 40;
        this.RowManager = new RowManager(this);
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

        if(this.hasFormulaInput){
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
        this.tb.append(document.createElement('div'))
        this.t.append(this.th, this.tb)
        this.th.append(this.header_row(Object.entries(this.schema)))
        //this.append_rows(this.)
        for(var i = 0; i < this.row_count; i++){
            var r = this.RowManager.new_row(i, {});
            this.tb.getElementsByTagName('div')[0].append(r)
        }
    }

    ViewView(){
        this.full_clear();
        this.t.append(this.th, this.tb)
        this.th.append(this.header_row(Object.entries(this.schema)))
        if(this.tb.getElementsByTagName('div')[0] == undefined){
            this.tb.append(document.createElement('div'))
        }
        if(window.UserManager.current_user.permission_level == 1){
            window.API.Query({skip: this.skip, limit: this.limit, table_name:'inventory', query:{}}).then(res => {
                this.append_rows(res);
            })
        }else{
            window.app.current_query = {skip: this.skip, limit: this.limit, table_name:'inventory', query:{by:window.UserManager.getInitials()}}
            window.API.Query(window.app.current_query).then(res => {

                this.append_rows(res);
            })
        }
        this.SetupEvents();
    }


    refresh(a){
        //console.log(`parent ${a}`)
        //console.log(`refreshing... admin mode: ${window.app.admin_mode}`)
        this.skip = 0;
        window.API.get_schema(this.table_name, window.app.admin_mode).then(schema => {
            this.schema = schema;
            if(this.mode == 'view'){
                this.ViewView();
            }else{
                this.EditView();
            }
        })
    }

    full_clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
        this.RowManager.rows = [];
    }


    append_rows(data){
        for(var d of data){
            var c = this.RowManager.rows.length + 1
            var new_row = this.RowManager.new_row(c, d)
            this.tb.getElementsByTagName('div')[0].append(new_row)
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

    SetupEvents(){
        this.tb.onscroll = (ev) => {
            if (this.tb.scrollTop + this.tb.clientHeight >= this.tb.scrollHeight) {
                this.skip += this.limit;
                var q = (window.UserManager.current_user.permission_level > 0) ? {} : {by: window.UserManager.getInitials()}
                window.app.current_query = {skip: this.skip, limit: this.limit, table_name:'inventory', query:q}
                window.API.Query(window.app.current_query).then(res => {
                    this.append_rows(res);
                })
            }
        }
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.CreateStructure()
            this.PreStyle();
            return this;
        })



        window.Dispatcher.on('UPDATE', () => {
            console.log('UPDATE')
            this.refresh()
        })
        
    }

}

class RowManager{
    constructor(Table){
        this.rows = []; //loaded rows
        this.row_count = 0; //number of rows
        this.table = Table;
    }

    UpdateLayout(){
        this.rows.forEach(row => {

        })
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
        this.rows.push(row);
        this.row_count += 1;
        return row;
    }
}

window.customElements.define('table-data', Table)
export default Table;
