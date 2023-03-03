import CustomInput from '/components/CustomInput.js'


export default class UserControls extends HTMLElement{
    constructor(){
        super();
        this.controls = [   
            {
                type:'button',
                name: 'View',
                icons:'info',
                width: '50%',
                toggle: true,
                onclick: () => {
                    if(window.app.view_mode == 'view'){
                        window.app.view_mode = 'edit';
                        window.TableData.create_structure()
                    }else{
                        window.TableData.create_structure()
                        window.app.view_mode = 'view';
                        if(window.UserManager.current_user.user_level == 1){
                            window.API.get_inventory(window.UserManager.current_user).then(res => {
                                window.TableData.append_rows(window.API.sort(res, 'date', true));
                            })
                            
                        }else{
                            window.API.get_inventory(window.UserManager.current_user).then(res => {
                                window.TableData.append_rows(window.API.sort(res, 'date', true));
                            })
                        }
                    }
                }
            },
            {   
                type:'button',
                name: 'ADMIN MODE',
                icons:'info',
                width: '50%',
                toggle: true,
                auth_required: true,
                onclick: () => {
                    if(window.app.admin_mode){
                        window.app.admin_mode = false;
                    }else{
                        window.app.admin_mode = true;
                    }

                    window.API.get_schema('inventory', window.app.admin_mode).then(schema => {
                        window.TableData.schema = schema;
                        window.TableData.create_structure();
                        if(window.app.view_mode == 'view'){
                            window.API.get_inventory().then(res => {
                                window.TableData.append_rows(res);
                            })
                        }
                    })

                }
            },
            {   
                type:'button',
                name: 'Export .Xlsx',
                width: '100%',
                auth_required: true,
                onclick: () => {
                    window.API.export_xlsx().then(res => {
                        
                        //window.open(res, '_blank');
                    })
                }
            },
            {
                width: '100%',
                auth_required: true,
                type:"query_controls",
                name: 'Query Controls',
            },
            {
                width: '100%',
                type:'parts_needed_list',
                name: 'Parts Needed List',
            }
        ];
        return this;
    }

    connectedCallback(){
        this.create_structure();
    }

    create_structure(){
        this.innerHTML = '';
        this.controls.forEach(item => {


            if(item.type == 'button'){
                var e = new CustomInput({type:'button', text: item.name, icon: item.icon, width: item.width, height: '30px', margin:'5px', onclick: item.onclick, toggle: item.toggle, toggled: item.toggled})
            }else{
                if(item.type == 'query_controls'){
                    var e = new QueryControls();
                }
                if(item.type == 'parts_needed_list'){
                    var e = new PartsNeededList();
                }

                e.style.margin = '5px';
                e.style.width = `calc(${item.width} - 10px)`;
            }



            item.auth_required ? window.UserManager.current_user.permission_level == 1 ? this.append(e) : {} : this.append(e)
           

            this.style.overflow = 'scroll'
            this.style.display = 'block';
            this.style.position = 'absolute';
            this.style.width = '100%'
            this.style.height = '100%'
        })
    }
}


class QueryControls extends HTMLElement{
    constructor(){
        super();
        this.fields = [];
    }

    connectedCallback(){
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = 'auto';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Query Controls</p>';
  



        this.query_fields = [];
        this.query_field_inputs = [];

        this.query_fields_container = document.createElement('div');
        this.query_field_inputs_container = document.createElement('div');

        this.script_mode = new CustomInput({type: 'button', text: 'Script Mode', icon:'code', background_color:'#e74c3c', width:'50%', height:'30px', margin:'5px', toggle:true, toggled:false})
        this.easy_mode = new CustomInput({type: 'button', text: 'Easy Mode', icon:'cake', background_color:'#16a085', width:'50%', height:'30px', margin:'5px', toggle:true, toggled:true})
        this.control_type_container = document.createElement('div');
        this.control_type_container.style.width = '100%';
        this.query_field_inputs_container.style.width = '100%';
        this.query_field_inputs_container.style.height = '40px';
        this.script_input = new CustomInput({type: 'textarea', placeholder: 'Query Script', width:'100%', height:'120px', margin:'5px'})
        this.submit_query_button = new CustomInput({type: 'button', text: 'Submit Query', icon:'send', width:'100%', height:'30px', margin:'5px'})

        this.easy_mode.onclick = () => {
            this.query_mode = 'easy';
            this.query_fields_container.innerHTML = '';
            this.control_type_container.innerHTML = '';
            for(var i = 0; i < 2; i++){
                var qf = new QueryField(i, this.query_field_inputs_container)
                this.query_fields_container.append(qf.input)
                setTimeout(() => {
                    qf.SetInputContainerWidth();
                }, 100)
            }

            this.control_type_container.append(this.query_fields_container, this.query_field_inputs_container);
        }

        this.script_mode.onclick = () => {
            this.query_mode = 'script';
            this.control_type_container.innerHTML = '';
            this.control_type_container.append(this.script_input)
        }

        this.submit_query_button.onclick = (ev) => {
            if(this.query_mode == 'easy'){
                var field = this.field_selector.value;
                if(this.field_selector.value == 'date'){
                    var value = [this.range1, this.range2];
                }else{
                    var value = this.search_text_input.value;
                }
    
                window.app.current_query = {field: field, value: value}
            }

            if(this.query_mode == 'script'){
                window.app.current_query = {field: field, value: value}
                
            }

            window.API.query('inventory', field, value).then(res => {
                window.TableData.append_rows(res)
            })
        }
       

        this.append(this.easy_mode, this.script_mode, this.control_type_container, this.submit_query_button)
    }
}

class QueryField{
    constructor(id, input_div){
        this.input_div = input_div;
        this.input_container = document.createElement('div')
        
       

        var colors = ['#2c3e50', '#34495e']
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

        this.inputs = [];
        this.input = new CustomInput({type: 'dropdown', text:`Field ${id}`, background_color: colors[id], icon:'keyboard_double_arrow_down', width:'50%', height:'30px', margin:'5px', items:field_items})
        this.input.setAttribute('field_id', id)

        this.input.onchange = (ev) => {
            var field_count = (ev.target.value == 'date' ? 2 : 1);
            this.ClearInputs();
            for(var i = 0; i < field_count; i++){
                this.inputs.push(new QueryFieldInput(ev.target.getAttribute('field_id'), field_count))
                
                this.input_container.append(this.inputs[i])
            }
            this.input_div.append(this.input_container)
        }

        return this
    }

    SetInputContainerWidth(){
        this.input_container.style.width = this.input.offsetWidth + 'px';
    }

    ClearInputs(){
        this.inputs.forEach(input => {
            console.log(input)
            input.remove();
        })
        this.inputs = []
    }
}


class QueryFieldInput{
    constructor(parent_field, count){
        var colors = ['#2c3e50', '#34495e']
        var input = new CustomInput({type: 'text', placeholder: `Input ${parent_field}`, background_color: colors[parent_field], width:`calc(50% / ${count})`, height:'30px', margin:'5px'})
        return input;
    }
}

class PartsNeededList extends HTMLElement{
    constructor(){
        super();
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = '200px';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Parts Needed List</p>';
        this.textarea = document.createElement('textarea');
        this.textarea.setAttribute('placeholder', 'Enter parts needed here');
        this.textarea.style.width = 'calc(100% - 10px)';
        this.textarea.style.height = 'calc(100% - 80px)';
        this.textarea.style.margin = '5px';
        this.textarea.style.borderRadius = '5px';
        this.textarea.style.border = 'none';
        this.textarea.style.background = 'var(--window-color-2)';
        this.textarea.style.color = 'white';
        this.textarea.style.padding = '5px';
        this.textarea.style.resize = 'none';
        this.textarea.style.outline = 'none';

        this.submit_button = new CustomInput({type: 'button', text: 'Submit', icon:'send', width:'100%', height:'30px', margin:'5px'})
        this.submit_button.onclick = (ev) => {
            window.API.set_parts_needed(this.textarea.value).then(res => {
                console.log(res)
                this.update();
            })
        }


        this.append(this.textarea, this.submit_button);
    }

    connectedCallback(){
        this.update();
    }

    update(){
        window.API.get_parts_needed().then(res => {
            this.textarea.value = res[0].data;
        })
    }
}

//search by any feild.
//sort by date, 
//sort alpabetically by item_name


window.customElements.define('query-controls', QueryControls);
window.customElements.define('user-controls', UserControls);
window.customElements.define('parts-needed-list', PartsNeededList);