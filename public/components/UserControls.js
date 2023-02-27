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
                        console.log(res)
                        window.TableData.append_rows(res);
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
                onclick: () => {
                    window.API.export_xlsx().then(res => {
                        console.log(res)
                        window.open('/API/download', '_blank');
                    })
                    //send request to server to convert all data to xlsx
                    //then we will redirect user to download file in a new tab automatically
                }
            },
            {
                type:"query_controls",
                name: 'Query Controls',
            }
        ];
        return this;
    }

    connectedCallback(){
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
            this.append(e)

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
        
        var query_by_container = document.createElement('div');
        query_by_container.style.display = 'block';
        query_by_container.style.width = 'auto';
        query_by_container.style.height = '60px';
        query_by_container.style.margin = '5px';
        query_by_container.style.borderRadius = '5px';
        query_by_container.style.background = 'var(--window-color-2)';
        this.append(query_by_container)

        var column_selector_container = document.createElement('div');
        column_selector_container.style.display = 'block';
        column_selector_container.style.width = 'auto';
        column_selector_container.style.height = '25px';
        column_selector_container.style.margin = '5px';
        column_selector_container.style.borderRadius = '5px';
        column_selector_container.style.background = 'var(--window-color-2)';
        this.append(column_selector_container)
    }
}


window.customElements.define('query-controls', QueryControls);
window.customElements.define('user-controls', UserControls);