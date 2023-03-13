import CustomInput from '/components/CustomInput.js'
import Table from '/components/Table.js'

export default class PartsNeededList extends HTMLElement{
    constructor(){
        super();
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = 'auto';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Parts Needed List</p>';

        this.submit_button = new CustomInput({type: 'button', text: 'Submit', icon:'send', width:'100%', height:'30px', margin:'5px'})
        this.submit_button.onclick = (ev) => {
            window.API.set_parts_needed(this.textarea.value).then(res => {
                console.log(res)
                this.update();
            })
        }

        this.table_container = document.createElement('div');
        this.table = new Table({table_name:'parts_needed_list', mode:'view'})
        this.table_container.append(this.table)
        this.table_container.style.height = '200px'
        this.table_container.style.marginBottom = '20px'

        this.append(this.table_container, this.submit_button);
    }

}

window.customElements.define('parts-needed-list', PartsNeededList);