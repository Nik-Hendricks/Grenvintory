import CustomInput from '/components/CustomInput.js'
import TableRow from '/components/TableRow.js'

class Table extends HTMLElement{
    constructor(props){
        super();
        this.props = props
        this.table_name = props.table_name;
        this.row_count = 100;
        this.row_cells = Array(this.row_count).fill([]);
        this.rows = []
        this.row = 0;
        this.col = 0;
        this.current_cell = null;
        this.hasFormulaInput = (typeof props.hasFormulaInput !== 'undefined') ? props.hasFormulaInput: false;
        this.mode = (typeof props.mode !== 'undefined') ? props.mode: 'add';
        this.delete_mode = 'false';
        this.cached_rows = [];
        this.skip = 0;
        this.limit = 40;
    }


    CacheRows(){
        this.cached_rows = this.rows;
    }

    connectedCallback(){
        window.API.get_schema(this.table_name).then(schema => {
            this.schema = schema;
            this.t = document.createElement('div');
            this.th = document.createElement('div');
            this.tb = document.createElement('div');
            this.detailed_cell = new CustomInput({width: '100%', height: '35px', type: 'text', text: 'Detailed View', icon:'info', margin:'5px'})

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



            this.detailed_cell.setAttribute('type', 'text')
    
            this.t.append(this.th, this.tb)
            this.append(this.t)
            if(this.hasFormulaInput){
                this.append(this.detailed_cell)
            }

            this.refresh()

            this.tb.onscroll = (ev) => {
                console.log(this.tb.scrollTop)
                console.log(this.tb.getElementsByTagName('div')[0].offsetHeight)
                if (this.tb.scrollTop + this.tb.clientHeight >= this.tb.scrollHeight) {
                    this.Count().then(c => {
                        var count = c.count;
                        if(this.skip + this.limit == count){

                        }else{
                            if(this.skip + this.limit >= count){
                                this.skip = count - this.limit;
                            }else{
                                this.skip += this.limit;
                            }
                            this.refresh();
                        }

                    })
                }
            }

            this.create_structure();
            return this;
        })
    }

    Count(){
        return new Promise(resolve => {
            window.API.Count(this.table_name).then(count => {
                resolve(count)
            })
        })
    }

    AppendRow(){

    }


    HybridView(){

    }

    EditView(){

    }

    ViewView(){
        if(this.tb.getElementsByTagName('div')[0] == undefined){
            this.tb.append(document.createElement('div'))
        }
        if(window.UserManager.current_user.permission_level == 1){
            window.API.Query({skip: this.skip, limit: this.limit, table_name:'inventory', query:{}}).then(res => {
                this.append_rows(window.API.sort(res, 'date', true));
            })
        }else{
            if(this.table_name == 'inventory'){
                window.API.Query({skip: this.skip, limit: this.limit, table_name:'inventory', query:{by:window.UserManager.getInitials()}}).then(res => {
                    this.append_rows(window.API.sort(res, 'date', true));
                })
            }else{
                window.API.Query({skip: this.skip, limit: this.limit, table_name:'inventory', query:{}}).then(res => {
                    this.append_rows(window.API.sort(res, 'date', true));
                })
            }
        }
    }


    refresh(){
        window.API.get_schema(this.table_name, window.app.admin_mode).then(schema => {
            this.schema = schema;
            if(this.mode == 'view'){
                this.ViewView();
            }else{
                this.create_structure();
            }
        })
    }

    create_structure(){
        this.full_clear();
        this.tb.append(document.createElement('div'))
        this.t.append(this.th, this.tb)
        this.th.append(this.header_row(Object.entries(this.schema)))
        if(this.mode == 'add'){
            for(var i = 0; i < this.row_count; i++){
                var r = this.new_row(i, {});
                this.tb.getElementsByTagName('div')[0].append(r)
            }
        }
        return this;
    }

    full_clear(){
        this.th.innerHTML = '';
        this.tb.innerHTML = '';
        this.rows = [];
    }

    clear(){
        this.tb.innerHTML = '';
        this.rows = [];
    }

    new_row(row_num, data){
        var row = new TableRow({table: this, row_num: row_num, data: data});
        this.rows[row_num] = row;
        return row
    }

    append_rows(data){
        console.log(data)
        for(var d of data){
            var c = this.rows.length + 1
            var new_row = this.new_row(c, d)
            this.rows[c] = new_row
            if(document.getElementById(d._id) != undefined){
                document.getElementById(d._id).remove();
            }
            this.tb.getElementsByTagName('div')[0].append(new_row)
        }
    }

    CreateStructure(){
        //header needs to update dynamically as col shema changes
        //full table rebuild
        //need to add hybrid view;
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

}

window.customElements.define('table-data', Table)
export default Table;
