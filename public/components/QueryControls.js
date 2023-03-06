import CustomInput from '/components/CustomInput.js'
import JsonEditor from '/components/JSONEditor.js'

export default class QueryControls extends HTMLElement{
    constructor(){
        super();
        this.field_columns = [];
    }

    PreStyle(){
        this.title_el.style.margin = '0px';
        this.title_el.style.textAlign = 'center';
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = 'auto';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
    }

    CreateStructure(){
        this.title_el = document.createElement('p')
        this.title_el.innerHTML += 'Query Controls';
        this.script_mode = new CustomInput({type: 'button', text: 'Script Mode', icon:'code', background_color:'#e74c3c', width:'50%', height:'30px', margin:'5px', toggle:true, toggled:false})
        this.easy_mode = new CustomInput({type: 'button', text: 'Easy Mode', icon:'cake', background_color:'#16a085', width:'50%', height:'30px', margin:'5px', toggle:true, toggled:true})
        this.control_type_container = document.createElement('div');
        this.submit_query_button = new CustomInput({type: 'button', text: 'Submit Query', icon:'send', width:'100%', height:'30px', margin:'5px'})
        

        this.append(this.title_el, this.easy_mode, this.script_mode, this.control_type_container, this.submit_query_button)
    }

    EasyView(){
        this.mode = 'easy';
        this.control_type_container.innerHTML = '';
        this.field_count_selector = new CustomInput({type: 'dropdown', text:'Field Count', icon:'expand_more', width:'100%', height:'30px', margin:'5px', items:[{text:'1', icon:''},{text:'2', icon:''}, {text:'3', icon:''}, {text:'4', icon:''}, {text:'5', icon:''}]})

        this.field_count_selector.onchange = (ev) => {
            this.ClearFieldControls();
            this.CreateFieldControls(ev.target.value);
        }

        this.control_type_container.append(this.field_count_selector)
    }

    AdvancedView(){
        this.mode = 'advanced';
        this.control_type_container.innerHTML = '';
        this.textarea = new CustomInput({type: 'textarea', placeholder: 'Enter query here', width:'100%', height:'100px', margin:'5px'})
        this.control_type_container.append(this.textarea)
    }

    CreateFieldControls(count){
        for(var i = 0; i < count; i++){
            var group_container = this.GroupContainer(count);
            this.control_type_container.append(group_container);
            group_container.append(this.FieldSelector(i, count));
            this.field_columns[i] = group_container;
        }
    }

    ClearFieldControls(){
        this.field_columns.forEach((el) => {
            el.remove();
        })
        this.field_columns = [];
    }

    FieldSelector(i, count){
        var inputs = []
        var field_items = [
            {text:'from', icon: 'person'},
            {text:'to', icon: 'person'},
            {text:'quantity', icon: 'info'},
            {text:'item_name', icon: 'category'},
            {text:'serial_number', icon: '123'},
            {text:'by', icon: 'person'},
            {text:'reason', icon: 'info'},
            {text:'date', icon: 'calendar_month'}
        ]

        
        var input = new CustomInput({type: 'dropdown', text:`Field ${i}`, icon:'expand_more', width:`calc(calc(${this.parentElement.offsetWidth}px / ${count}) - 10px)`, height:'30px', margin:'5px', items: field_items})
        input.classList.add('field')
        input.onchange = (ev) => {
            if(inputs.length > 0){
                for(var j = 0; j < inputs.length; j++){
                    inputs[j].remove();
                }
            }

            var _c = (ev.target.value == 'date') ? 2 : 1;
            console.log(ev.target.value)
            console.log(_c)
            for(var j = 0; j < _c; j++){
                var e = new CustomInput({type: 'text', text:`Value ${j}`, width:`calc(100% / ${_c})`, height:'30px', margin:'5px'})
                e.classList.add('field-data')
                this.field_columns[i].append(e)
                inputs.push(e)
            }
        }
        return input
    }

    GroupContainer(count){
        var el = document.createElement('div');
        el.style.display = 'inline-block';
        el.style.width = `calc(100% / ${count})`;
        el.style.height = 'auto';
        el.style.float = 'left';
        return el;
    }

    connectedCallback(){
        this.CreateStructure();
        this.PreStyle()
        this.easy_mode.onclick = () => {
            this.EasyView();
        }

        this.script_mode.onclick = () => {
            this.AdvancedView();
        }

        this.submit_query_button.onclick = (ev) => {
            if(this.mode == 'easy'){
                var query_string = {};
                var query_fields = [];
                var query_data = [];
                //populate query fields
                for(var e of this.getElementsByClassName('field')){
                    if(e.value.toLowerCase().includes('field') == false){
                        query_fields.push(e.value)
                    }
                }
                for(var e of this.getElementsByClassName('field-data')){
                    if(e.value != '' || e.value != undefined){
                        query_data.push(e.value)
                    }
                }

                query_fields.forEach(_e => {
                    if(query_fields.length > 1){
                        query_string = {$and: []}
                        var qfc = 0;
                        if(_e == 'date'){

                        }else{
                            query_data.forEach(e => {
                                if(e.length > 0){
                                    query_string.$and.push({[query_fields[qfc]]:e})
                                }else{
                                    query_fields[qfc] = undefined;
                                }
                                qfc++;
                            })
                        }
                    }else{
                        if(_e == 'date'){

                        }else{
                            query_string[_e] = query_data[query_fields.indexOf(_e)]
                        }
                    }

                    
                    console.log(query_string)
                })
                window.app.current_query = {table_name:'inventory', query:query_string};
            }
            else if(this.mode == 'advanced'){
                window.app.current_query = {table_name:'inventory', query:this.textarea.value};
            }

            window.API.Query(window.app.current_query).then(res => {
                window.TableData.append_rows(res)
            })
        }
    }

}

window.customElements.define('query-controls', QueryControls)