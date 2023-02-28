export default class AuthenticationPrompt extends HTMLElement{
    constructor(){
            super();
            this.obsfucator = document.createElement('div');
            this.content_container = document.createElement('div');
            this.title_el = document.createElement('p');
    
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
            this.content_container.style.width = '170px';
            this.content_container.style.height = '70px';
            this.content_container.style.background = 'var(--window-color-1)';
            this.content_container.style.borderRadius = '5px';
            this.content_container.style.zIndex = '1001';

            this.title_el.style.margin = '0px';
            this.title_el.style.padding = '0px';
            this.title_el.style.textAlign = 'center';
            this.title_el.style.color = 'white';
            this.title_el.style.width = '100%';
            this.title_el.style.height = '20px';
            this.title_el.style.background = 'var(--window-color-2)';
            this.title_el.style.borderTopLeftRadius = '5px';
            this.title_el.style.borderTopRightRadius = '5px';
    
            this.title_el.innerHTML = 'Enter PIN';

            this.content_container.append(this.title_el);
            this.append(this.obsfucator, this.content_container);   
            return this;

    }

    connectedCallback(){

    }

    init(callback){
        for(var i = 0; i < 4; i++){
            var input = document.createElement('input');
            input.style.width = '30px'
            input.style.height = '30px'
            input.style.marginLeft = '10px';
            input.style.marginTop = '10px';
            input.style.background = 'transparent';
            input.style.border = 'none';
            input.style.borderBottom = '1px solid white';
            input.style.outline = 'none';
            input.style.color = 'white'
            input.style.textAlign = 'center';
            input.setAttribute('char', '');

            input.addEventListener('input', (ev) => {
                ev.preventDefault();
                ev.target.setAttribute('char', ev.target.value);
                ev.target.value = "*"
                var p = this.check_inputs();
                if(p!=false){
                    this.remove();
                    callback(p);           
                }
                if(ev.target.nextElementSibling !== null){
                    ev.target.nextElementSibling.focus();
                }
            })

            this.content_container.append(input);
            this.getElementsByTagName('input')[0].focus();
        }
    }

    check_inputs(){
        var inputs = this.getElementsByTagName('input');
        var ret = '';
        for(var i = 0; i < inputs.length; i++){
            if(inputs[i].getAttribute('char') == ''){
                return false;
            }
            ret += inputs[i].getAttribute('char');
        }
        return ret;
    }


}

window.customElements.define('authentication-prompt', AuthenticationPrompt);