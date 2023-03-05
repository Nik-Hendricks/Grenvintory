import CustomInput from '/components/CustomInput.js';

export default class Prompt extends HTMLElement{
    constructor(props){
            super();
            this.title = (typeof props.title !== 'undefined') ? props.title : 'Prompt';
            this.text = (typeof props.text !== 'undefined') ? props.text : 'This is a prompt';
            this.width = (typeof props.width !== 'undefined') ? props.width : '300px';
            this.height = (typeof props.height !== 'undefined') ? props.height : '150px';
            this.icon = (typeof props.icon !== 'undefined') ? props.icon : 'info';
            this.buttons = (typeof props.buttons !== 'undefined') ? props.buttons : [{text: 'Ok', color: 'var(--green)'}];
            this.error = (typeof props.error !== 'undefined') ? props.error : false;
            document.body.append(this)
            return this;

    }

    CreateStructure(){
        this.obsfucator = document.createElement('div');
        this.content_container = document.createElement('div');
        this.title_el = document.createElement('p');
        this.icon_el = document.createElement('i');
        this.text_el = document.createElement('p');
        this.button_container = document.createElement('div');


        this.text_el.innerHTML = this.text;

        this.icon_el.className = 'material-icons';
        this.icon_el.innerHTML = this.icon;

        this.title_el.innerHTML = this.title;
        this.title_el.append(this.icon_el);
        this.content_container.append(this.title_el, this.text_el, this.button_container);

        this.buttons.forEach((button) => {
            var bc = (this.error && this.buttons.length == 1) ? '#e74c3c' : button.color;
            var button_el = new CustomInput({type: 'button', text: button.text, background_color: bc, width: '25%', height: '30px', margin: '5px'});
            button_el.addEventListener('click', () => {
                this.remove();
            })
            this.button_container.append(button_el);
            button_el.style.float = 'right';
        });

        this.append(this.obsfucator, this.content_container);   
    }

    PreStyle(){
    
        this.obsfucator.style.position = 'fixed';
        this.obsfucator.style.top = '0px';
        this.obsfucator.style.left = '0px';
        this.obsfucator.style.width = '100%';
        this.obsfucator.style.height = '100%';
        this.obsfucator.style.background = 'rgba(0,0,0,0.8)';
        this.obsfucator.style.zIndex = '1000';

        this.content_container.style.position = 'fixed';
        this.content_container.style.top = '50%';
        this.content_container.style.left = '50%';
        this.content_container.style.transform = 'translate(-50%, -50%)';
        this.content_container.style.width = this.width;
        this.content_container.style.height = this.height;
        this.content_container.style.background = 'var(--window-color-1)';
        this.content_container.style.borderRadius = '5px';
        this.content_container.style.zIndex = '1001';

        this.title_el.style.margin = '0px';
        this.title_el.style.padding = '5px 0px 5px 0px';
        this.title_el.style.textAlign = 'center';
        this.title_el.style.color = 'white';
        this.title_el.style.width = '100%';
        this.title_el.style.height = '20px';
        this.title_el.style.background = 'var(--window-color-2)';
        this.title_el.style.borderTopLeftRadius = '5px';
        this.title_el.style.borderTopRightRadius = '5px';

        this.icon_el.style.fontSize = '20px';
        this.icon_el.style.position = 'relative';
        this.icon_el.style.top = '0px';
        this.icon_el.style.left = '5px';
        this.icon_el.style.color = (this.error) ? '#e74c3c' : '#1abc9c' ;
        this.icon_el.style.float = 'left';

        this.text_el.style.position = 'absolute';
        this.text_el.style.width = 'calc(100% - 10px)';
        this.text_el.style.height = 'auto';
        this.text_el.style.margin = '5px';
        this.text_el.style.top = '50%';
        this.text_el.style.marginTop = '-10px';
        this.text_el.style.fontSize = '15px';
        this.text_el.style.textAlign = 'center';

        this.text_el.style.color = 'white' ;

        this.button_container.style.width = '100%';
        this.button_container.style.height = 'auto';
        this.button_container.style.position = 'absolute';
        this.button_container.style.bottom = '0px';

    }

    connectedCallback(){
        this.CreateStructure();
        this.PreStyle();

        this.obsfucator.addEventListener('click', () => {
            this.remove();
        }) 
    }

    init(callback){

    }

}

window.customElements.define('custom-prompt', Prompt);