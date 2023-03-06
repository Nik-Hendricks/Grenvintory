import CustomInput from '/components/CustomInput.js'
import QueryControls from '/components/QueryControls.js'
import PartsNeededList from '/components/PartsNeededList.js'
import DataManager from '/components/DataManager.js'


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
                toggled: false,
                onclick: () => {
                    if(window.TableData.mode == 'add'){
                        window.TableData.mode = 'view';
                    }else{
                        window.TableData.mode = 'add';
                    }
                    window.TableData.refresh()
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
                    window.TableData.refresh()

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

window.customElements.define('user-controls', UserControls);
