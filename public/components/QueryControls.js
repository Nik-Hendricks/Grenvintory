import CustomInput from '/components/CustomInput.js'

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
        this.CreateFieldControls();
    }

    AdvancedView(){
        this.mode = 'advanced';
        this.control_type_container.innerHTML = '';
        this.textarea = new CustomInput({type: 'textarea', placeholder: 'Enter query here', width:'100%', height:'100px', margin:'5px'})
        this.control_type_container.append(this.textarea)
    }

    CreateFieldControls(){
        var count = 2;
        for(var i = 0; i < count; i++){
            var group_container = this.GroupContainer(count);
            this.control_type_container.append(group_container);
            group_container.append(this.FieldSelector(i, count));
            this.field_columns[i] = group_container;
        }
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

        var input = new CustomInput({type: 'dropdown', text:`Field ${i}`, icon:'expand_more', width:`calc(200% / ${count})`, height:'30px', margin:'5px', items: field_items})

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
                var e = new CustomInput({type: 'input', text:`Value ${j}`, width:`calc(100% / ${_c})`, height:'30px', margin:'5px'})
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

            }
            else if(this.mode == 'advanced'){
                window.API.Query({table_name:'inventory', query:this.textarea.value}).then(res => {

                })
            }
        }
    }

}

window.customElements.define('query-controls', QueryControls)