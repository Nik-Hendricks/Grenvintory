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
                        window.API.get_inventory(window.UserManager.current_user).then(res => {
                            console.log(window.API.sort(res, 'date', true))
                            window.TableData.append_rows(window.API.sort(res, 'date', true));
                        })
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
        })
    }
}


class QueryControls extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = '200px';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Query Controls</p>';
  

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

        this.field_selector = new CustomInput({type: 'dropdown', text:'field', icon:'keyboard_double_arrow_down', width:'100%', height:'30px', margin:'5px', items:field_items})
        this.search_fields = document.createElement('div');
        this.search_text_input = new CustomInput({type: 'text', placeholder: 'test', width:'100%', height:'30px', margin:'5px'})

        this.field_selector.onchange = (ev) => {
            if(ev.target.value == 'date'){
                this.search_fields.innerHTML = '';
                this.range1 = new CustomInput({type: 'text', placeholder: 'test', width:'50%', height:'30px', margin:'5px'})
                this.range2 = new CustomInput({type: 'text', placeholder: 'test', width:'50%', height:'30px', margin:'5px'})
                this.search_fields.append(this.range1, this.range2)
            }else{
                this.search_fields.innerHTML = '';
                this.search_fields.append(this.search_text_input);
            }
        }

        this.submit_query_button = new CustomInput({type: 'button', text: 'Submit Query', icon:'send', width:'100%', height:'30px', margin:'5px'})

        this.submit_query_button.onclick = (ev) => {
            var field = this.field_selector.value;
            if(this.field_selector.value == 'date'){
                var value = [this.range1, this.range2];
            }else{
                var value = this.search_text_input.value;
            }

            window.app.current_query = {field: field, value: value}
            window.API.query('inventory', field, value).then(res => {
                window.TableData.append_rows(res)
            })
        }

        this.append(this.field_selector, this.search_fields, this.submit_query_button)
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