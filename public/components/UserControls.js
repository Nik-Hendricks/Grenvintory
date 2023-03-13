import CustomInput from '/components/CustomInput.js'
import QueryControls from '/components/QueryControls.js'
import PartsNeededList from '/components/PartsNeededList.js'
import DataManager from '/components/DataManager.js'


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
        this.create_structure();
    }

    create_structure(){
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
                icons: ['visibility_off', 'visibility'],
                modes: ['add', 'view'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                onclick: (ev) => {
                    window.Table.mode = ev.target.getAttribute('toggled');
                }
            },
            {
                icons: ['admin_panel_settings', 'admin_panel_settings'],
                modes: ['false', 'true'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                onclick: (ev) => {
                    window.app.admin_mode = ev.target.getAttribute('toggled');
                }
            },
            {
                icons: ['delete', 'table_rows', 'crop_free'],
                modes: ['false', 'row', 'cell'],
                colors: ['var(--window-color-3)', 'var(--blue)', 'var(--red)'],
                onclick: (ev) => {
                    window.Table.delete_mode = ev.target.getAttribute('toggled');
                }
            },
            {
                icons: ['settings', 'settings'],
                modes: ['false', 'true'],
                colors: ['var(--window-color-3)', 'var(--blue)'],
                toggle_icon: 'settings',
                onclick: () => {

                }
            },
        ]
    }

    IconButton(icons, onclick, toggled, modes, colors){
        var button_size = '40px'
        var e = document.createElement('i');
        e.setAttribute('toggled', modes[0])
        e.classList.add('material-icons', 'solid');
        e.style.display = 'inline-block';
        e.style.width = button_size;
        e.style.background = 'var(--window-color-3)';
        e.style.borderRadius = `calc(${button_size} / 2)`;
        e.style.cursor = 'pointer';
        e.style.textAlign = 'center';
        e.style.lineHeight = button_size;
        e.style.color = 'white';
        e.style.marginLeft = `calc(calc(calc(100% - ${button_size} * 4)/ 4)/2)`
        e.style.marginRight = `calc(calc(calc(100% - ${button_size} * 4)/ 4)/2)`
        e.style.marginBottom = '10px';
        e.style.transition = 'all ease-in 0.3s';
        e.style.marginTop = '10px';
        e.style.userSelect = 'none';
        e.icons = icons;
        e.modes = modes;
        e.colors = colors;
        e.innerHTML = icons[0];
        e.onclick = (e) => {
            var index = e.target.modes.indexOf(e.target.getAttribute('toggled'))
            if(index == e.target.modes.length -1){
                e.target.setAttribute('toggled', e.target.modes[0])
                e.target.innerHTML = e.target.icons[0]
                e.target.style.background = e.target.colors[0];
            }else{
                var new_index = index + 1;
                e.target.setAttribute('toggled', modes[new_index])
                e.target.innerHTML = e.target.icons[new_index]
                e.target.style.background = e.target.colors[new_index];
            }
            window.Table.clear();
            window.Table.refresh()
            onclick(e);
        };
        return e;
    }


    CreateStructure(){
        for(var button of this.items){
            this.append(this.IconButton(button.icons, button.onclick, button.toggled, button.modes, button.colors))
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
