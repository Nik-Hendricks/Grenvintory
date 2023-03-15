import CustomInput from '/components/CustomInput.js'
import QueryControls from '/components/QueryControls.js'
import PartsNeededList from '/components/PartsNeededList.js'
import DataManager from '/components/DataManager.js'
import IconButton from '/components/IconButton.js';


export default class UserControls extends HTMLElement{
    constructor(){
        super();
        this.controls = [   
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
            },
            {
                width: '100%',
                auth_required: true,
                type:'data_manager',
                name: 'Data Manager',
            }
        ];
        return this;
    }

    connectedCallback(){
        window.Dispatcher.on('SWITCH_USER', () => {
            this.refresh();
        })
    }

    refresh(){
        this.innerHTML = '';
        this.append(new TopControls())
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
                if(item.type == 'data_manager'){
                    var e = new DataManager();
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


class TopControls extends HTMLElement{
    constructor(){
        super()
        this.items = [
            {
                value_mapping: window.Table.mode,
                icons: ['visibility_off', 'visibility'],
                modes: ['add', 'view'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                onclick: (ev) => {
                    window.Table.mode = ev.target.getAttribute('toggled');

                }
            },
            {
                value_mapping: window.app.admin_mode,
                icons: ['admin_panel_settings', 'admin_panel_settings'],
                modes: ['false', 'true'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                onclick: (ev) => {
                    console.log(ev.target.getAttribute('toggled'))
                    window.app.admin_mode = ev.target.getAttribute('toggled');
            
                }
            },
            {
                value_mapping: window.Table.delete_mode,
                icons: ['delete', 'table_rows', 'crop_free'],
                modes: ['false', 'row', 'cell'],
                colors: ['var(--window-color-3)', 'var(--red-2)', 'var(--red)'],
                onclick: (ev) => {
                    console.log(ev.target.getAttribute('toggled'))
                    window.Table.delete_mode = ev.target.getAttribute('toggled');
            
                }
            },
            {
                icons: ['settings', 'settings'],
                modes: ['false', 'true'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                onclick: () => {

                }
            },
        ]
    }

    CreateStructure(){
        for(var button of this.items){
            this.append(new IconButton(button.icons, button.onclick, button.value_mapping, button.modes, button.colors))
        }
    }

    PreStyle(){

    }

    connectedCallback(){
        this.CreateStructure();
        this.PreStyle();
    }

}

window.customElements.define('user-controls', UserControls);
window.customElements.define('top-controls', TopControls);
