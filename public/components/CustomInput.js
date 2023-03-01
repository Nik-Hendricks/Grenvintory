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
        this.rows = (typeof this.props.rows !== 'undefined') ? this.props.rows : this.getAttribute('rows');
        this.toggle = (typeof this.props.toggle !== 'undefined') ? this.props.toggle : this.hasAttribute('toggle')
        this.width = (typeof this.props.width !== 'undefined') ? this.props.width : this.getAttribute('width');
        this.height = (typeof this.props.width !== 'undefined') ? this.props.height : this.getAttribute('height');
        this.margin = (typeof this.props.margin !== 'undefined') ? this.props.margin : this.getAttribute('margin');
        this.onfocus = this.style.webkitTransform = 'translate3d(0px,-10000px,0)'; requestAnimationFrame(function() { this.style.webkitTransform = ''; }.bind(this))
        this.init();
        return this;
    };

    set value(x){
        this.textContent = x;
    }

    get value(){
        return this.textContent;
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
    }

    preStyle(){
        this.style.position = 'relative';
        this.style.display = 'block';
        this.style.width = `calc(${this.width} - ${this.margin} * 2)`;
        this.style.height = this.height;
        this.style.background = 'var(--window-color-3)';
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

