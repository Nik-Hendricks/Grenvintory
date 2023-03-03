import Component from '/components/Component.js'

export default class CustomInput extends HTMLElement{
    constructor(props){
        super(props);
        this.props = props;
        this.type = (typeof this.props.type !== 'undefined') ? this.props.type : this.getAttribute('type');
        this.image = (typeof this.props.image !== 'undefined') ? this.props.image : this.getAttribute('image');
        this.icon = (typeof this.props.icon !== 'undefined') ? this.props.icon : this.getAttribute("icon")
        this.text = (typeof this.props.text !== 'undefined') ? this.props.text : this.getAttribute('text');
        this.secondary = (typeof this.props.secondary !== 'undefined') ? this.props.secondary : this.getAttribute('secondary')
        this.variant = (typeof this.props.variant !== 'undefined') ? this.props.variant : this.getAttribute('variant');
        this.items = (typeof this.props.items !== 'undefined') ? this.props.items : this.getAttribute('items');
        this.toggle = (typeof this.props.toggle !== 'undefined') ? this.props.toggle : this.hasAttribute('toggle')
        this.width = (typeof this.props.width !== 'undefined') ? this.props.width : this.getAttribute('width');
        this.height = (typeof this.props.width !== 'undefined') ? this.props.height : this.getAttribute('height');
        this.margin = (typeof this.props.margin !== 'undefined') ? this.props.margin : this.getAttribute('margin');
        this.fontSize = (typeof this.props.fontSize !== 'undefined') ? this.props.fontSize : '12px';
        this.toggle = (typeof this.props.toggle !== 'undefined') ? this.props.toggle : this.hasAttribute('toggle') ? this.getAttribute('toggle') : false;
        this.toggled = (typeof this.props.toggled !== 'undefined') ? this.props.toggled : this.hasAttribute('toggled') ? this.getAttribute('toggled') : false;
        this.backround_color = (typeof this.props.background_color !== 'undefined') ? this.props.background_color : this.hasAttribute('background_color') ? this.getAttribute('background_color') : 'var(--window-color-3)';
        this.placeholder = (typeof this.props.placeholder !== 'undefined') ? this.props.placeholder : this.hasAttribute('placeholder') ? this.getAttribute('placeholder') : '';
        this.onfocus = this.style.webkitTransform = 'translate3d(0px,-10000px,0)'; requestAnimationFrame(function() { this.style.webkitTransform = ''; }.bind(this))
        this.init();
        return this;
    };

    set value(x){
        if(this.type == 'dropdown'){
            this.getElementsByTagName('p')[0].textContent = x;
            var event = document.createEvent("HTMLEvents");
            event.initEvent("change", true, true);
            event.eventName = "change";
            this.dispatchEvent(event)
        }else if(this.type == "textarea"){
            this.textarea.value = x;
        }else{
            this.textContent = x;
        }
    }

    get value(){
        if(this.type == 'dropdown'){
            return this.getElementsByTagName('p')[0].textContent;
        }else if(this.type == 'textarea'){        
            return this.textarea.value;
        }else{
            return this.textContent;
        }
    }

    connectedCallback(){
        this.preStyle()

    }

    init(){
        if(this.type == "text"){
            this._is_text();
        }else if(this.type == "button"){
            this._is_button();
        }else if(this.type == 'dropdown'){
            this._is_dropdown();
        }else if(this.type == 'textarea'){
            this._is_textarea();
        }
    }


    _is_textarea(){
        this.textarea = document.createElement('textarea');
        this.textarea.setAttribute('placeholder', this.placeholder);
        this.append(this.textarea)
        this.onkeydown = () => {
            setTimeout(() => {
                this.value = this.textarea.value;
            }, 200)
        }
    }

    _is_text(){
        this.setAttribute('contenteditable', true);
        this.onkeydown = () => {
            setTimeout(() => {
                this.value = this.textContent;
            }, 200)
        }
    }

    _is_button(){
        this.innerHTML = `<i class="material-icons solid">${this.icon}</i><p>${this.text}</p>`;
        this.onclick = () => {
            this.props.onclick();
            if(this.toggle){
                if(this.toggled){
                    this.toggled = false;
                    this.style.background = 'var(--window-color-3)';
                }else{
                    this.toggled = true;
                    this.style.background = '#7289da';
                }
            }else{

            }
        }
    }

    _is_dropdown(){
        console.log('is dropdown')
        this.item_container = document.createElement('div')
        this.innerHTML =   `<i class="material-icons solid">${this.icon}</i><p>${this.text}</p>`
        if(this.items){
            this.append(this.item_container)
            this.item_container.style.width ='100%'
            this.item_container.style.height = 'auto'
            this.item_container.style.background = 'var(--window-color-1)'
            this.item_container.style.display = 'block'
            this.item_container.style.position = 'absolute'
            this.item_container.style.zIndex = '99'
            this.item_container.style.display = 'none'
            this.item_container.style.top = '30px'
            for(var item of this.items){

                var dropdown_item = new CustomInput({type:'button', icon: item.icon, text: item.text, width:'100%', height:'30px', margin:'5px'})
                dropdown_item.onclick = (ev) => {
                    console.log(ev)
                    this.value = event.target.textContent
                }

                this.getElementsByTagName('div')[0].append(dropdown_item)
            }

            this.onclick = () => {
                if(this.item_container.style.display == 'none'){
                    this.item_container.style.display = 'block'
                }else{
                    this.item_container.style.display = 'none'
                }
            }
        }

    }

    preStyle(){
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.width = `calc(${this.width} - ${this.margin} * 2)`;
        this.style.height = this.height;
        this.style.background = this.backround_color;
        this.style.borderRadius = '5px';
        this.style.margin = this.margin;
        this.style.color = 'white';
        this.style.transition = 'background ease-in-out 0.3s';
        this.style.cursor = 'pointer';
        this.style.lineHeight = this.height;
        this.style.outline = 'none';
        this.style.border = 'none';
        this.style.textAlign = 'center';
        this.style.userSelect = 'none';
        this.style.display = 'inline-block'
        console.log(this.fontSize)
        this.style.fontSize = this.fontSize

        if(this.getElementsByTagName('p').length > 0){
            var p = this.getElementsByTagName('p')[0];
            p.style.margin = '0px';
            p.style.padding = '0px';
            p.style.lineHeight = this.height;
            p.style.position = 'absolute';
            p.style.width = '100%'
            p.style.textAlign = 'center';
        }

        if(this.getElementsByTagName('i').length > 0){
            var icon = this.getElementsByTagName('i')[0];
            icon.style.margin = '0px';
            icon.style.padding = '0px';
            icon.style.display = 'block';
            icon.style.fontSize = '16px';
            icon.style.padding = '0px';
            icon.style.lineHeight = this.height;
            icon.style.position = 'absolute'
            icon.style.marginLeft = '5px';
        }

        if(this.getElementsByTagName('textarea').length > 0){
            this.textarea.style.width = '100%';
            this.textarea.style.height = '100%';
            this.textarea.style.margin = '0px';
            this.textarea.style.borderRadius = this.style.borderRadius;
            this.textarea.style.border = 'none';
            this.textarea.style.background = 'var(--window-color-2)';
            this.textarea.style.color = 'white';
            this.textarea.style.padding = '5px';
            this.textarea.style.resize = 'none';
            this.textarea.style.outline = 'none';
        }
    }

    putCursorAtEnd(){
        if(this.innerText && document.createRange)
        {
          window.setTimeout(() =>
            {
              let selection = document.getSelection();
              let range = document.createRange();
    
              range.setStart(this.childNodes[0],this.innerText.length);
              range.collapse(true);
              selection.removeAllRanges();
              selection.addRange(range);
            }
          ,1);
        }
    }

}
window.customElements.define('custom-input', CustomInput);

