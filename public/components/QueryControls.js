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
        this.style.display = 'block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = 'auto';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.style.float = 'right';
    }

    CreateStructure(){
        this.title_el = document.createElement('p')
        this.title_el.innerHTML += 'Query Controls';
        this.script_mode = new CustomInput({type: 'button', text: 'Script Mode', icon:'code', background_color:'var(--red)', width:'50%', height:'30px', margin:'5px', toggle:true, toggled:false})
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
               var query = this.ParseJSON()
            }
            else if(this.mode == 'advanced'){
               var query = this.textarea.value;
            }

            window.Table.tb.getElementsByTagName('div')[0].innerHTML = '';
            window.Table.ScrollManager.page = 0;
            window.Table.current_query = query;
            window.Table.Query(window.Table.current_query).then(res => {
                window.Table.append_rows(res)
                if(this.direction == 'up'){
                    this.tb.scrollTop = this.tb.scrollHeight;
                }
            })
        }
    }


    ParseJSON(){
        var fields = Array.from(document.querySelectorAll('.field')).map(input => input.value);
        var datas = Array.from(document.querySelectorAll('.field-data')).map(input => input.value);
        var query = {}

        for(var i = 0; i < fields.length; i++){
            var field = fields[i];
            var data = datas[i];
            console.log(field)
            var query = {};
            if (fields.length > 1) {
                query = {$and: []};
                for (var i = 0; i < fields.length; i++) {
                  var field = fields[i];
                  var data = datas[i];
                  console.log(field);
                  var subquery = {};
                  if (field == 'date') {
                    subquery[field] = { $gte: datas[i], $lte: datas[i+1] };
                    i++;
                  } else {
                    subquery[field] = data;
                  }
                  query.$and.push(subquery);
                }
              } else {
                if(field == 'date'){
                    var p1 = datas[i].split('/');
                    var p2 = datas[i+1].split('/');
                    var mydate = new Date(p1[2], p1[1] - 1, p1[0]); 
                    var mydate2 = new Date(p2[2], p2[1] - 1, p2[0]);


                    console.log(mydate.toDateString());

                   query[field] = { $gte: mydate, $lte: mydate2 }
                }else{
                    query[field] = data;
                }
              }
        }
        console.log(query)
        return query;
    }

}

window.customElements.define('query-controls', QueryControls)