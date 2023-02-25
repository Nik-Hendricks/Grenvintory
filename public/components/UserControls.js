export default class UserControls extends HTMLElement{
    constructor(){
        super();
        this.controls = [   
            {
                name: 'History',
                onclick: () => {
                    console.log('history');
                    window.API.get_inventory(window.UserManager.current_user).then(res => {
                        console.log(res)
                        window.TableData.append_rows(res);
                    })
                }
            },
            {
                name: 'Query',
                onclick: () => {
                    console.log('query');
                }
            },
            {
                name: 'Export .Xlsx',
                onclick: () => {
                    window.API.export_xlsx().then(res => {
                        console.log(res)
                        window.open('/API/download', '_blank');
                    })
                    //send request to server to convert all data to xlsx
                    //then we will redirect user to download file in a new tab automatically
                }
            }
        ];
        return this;
    }

    connectedCallback(){
        this.controls.forEach(item => {
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
            this.append(e)
        })
    }
}

window.customElements.define('user-controls', UserControls);