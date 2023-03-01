import CustomInput from '/components/CustomInput.js'


export default class UserControls extends HTMLElement{
    constructor(){
        super();
        this.controls = [   
            {
                type:'button',
                name: 'View',
                onclick: () => {
                    console.log('history');
                    window.API.get_inventory(window.UserManager.current_user).then(res => {
                        console.log(window.API.sort(res, 'date', true))
                        window.TableData.append_rows(window.API.sort(res, 'date', true));
                    })
                }
            },
            {
                type:'button',
                name: 'Edit',
                onclick: () => {
                    window.TableData.create_structure();
                }
            },
            {   
                type:'button',
                name: 'Export .Xlsx',
                auth_required: true,
                onclick: () => {
                    window.API.export_xlsx().then(res => {
                        console.log(res)
                        window.open('/API/download', '_blank');
                    })
                }
            },
            {
                auth_required: true,
                type:"query_controls",
                name: 'Query Controls',
            },
            {
                auth_required: false,
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
                var e = document.createElement('input')
                e.setAttribute('type', 'button')
                e.setAttribute('value', item.name)
                e.onclick = () => {
                    e.style.background = '#2C7A7B';
                    setTimeout(() => {
                        e.style.background = '#38B289';
                    }, 300)
                    item.onclick();
                };
                e.style.transition = 'background ease-in-out 0.3s';
                e.style.width = 'calc(100% - 10px)';
                e.style.height = '30px';
                e.style.margin = '5px';
                e.style.borderRadius = '5px';
                e.style.border = 'none';
                e.style.background = '#38B289';
                e.style.color = 'white';
            }
            if(item.type == 'query_controls'){
                var e = new QueryControls();
            }
            if(item.type == 'parts_needed_list'){
                var e = new PartsNeededList();
            }

            item.auth_required ? window.UserManager.current_user.permission_level == 1 ? this.append(e) : {} : this.append(e)
           


            this.style.display = 'block';
        })
    }
}


class QueryControls extends HTMLElement{
    constructor(){
        super();
    }

    connectedCallback(){
        this.style.display = 'block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = '200px';
        this.style.margin = '5px';
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

        this.field_selector = new CustomInput({type: 'dropdown', text:'field', icon:'info', width:'100%', height:'30px', margin:'5px', items:field_items})
        this.search_text_input = new CustomInput({type: 'text', placeholder: 'test', width:'100%', height:'30px', margin:'5px'})

        this.append(this.field_selector, this.search_text_input)
    }
}


class PartsNeededList extends HTMLElement{
    constructor(){
        super();
        this.style.display = 'block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = '200px';
        this.style.margin = '5px';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Parts Needed List</p>';
        this.textarea = document.createElement('textarea');
        this.textarea.setAttribute('placeholder', 'Enter parts needed here');
        this.textarea.style.width = 'calc(100% - 10px)';
        this.textarea.style.height = 'calc(100% - 30px)';
        this.textarea.style.margin = '5px';
        this.textarea.style.borderRadius = '5px';
        this.textarea.style.border = 'none';
        this.textarea.style.background = 'var(--window-color-2)';
        this.textarea.style.color = 'white';
        this.textarea.style.padding = '5px';
        this.textarea.style.resize = 'none';
        this.textarea.style.outline = 'none';

        this.append(this.textarea);
    }
}

//search by any feild.
//sort by date, 
//sort alpabetically by item_name


window.customElements.define('query-controls', QueryControls);
window.customElements.define('user-controls', UserControls);
window.customElements.define('parts-needed-list', PartsNeededList);