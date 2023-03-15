export default class IconButton extends HTMLElement{
    constructor(icons, onclick, toggled, modes, colors){
        super();
        this.icons = icons;
        this.modes = modes;
        this.colors = colors;
        this._onclick = onclick;
        this.button_size = '40px'
    }

    CreateStructure(){
        this.setAttribute('toggled', this.modes[0])
        this.classList.add('material-icons', 'solid');
        this.innerHTML = this.icons[0];
    }

    PreStyle(){
        this.style.display = 'inline-block';
        this.style.width = this.button_size;
        this.style.background = 'var(--window-color-3)';
        this.style.borderRadius = `calc(${this.button_size} / 2)`;
        this.style.cursor = 'pointer';
        this.style.textAlign = 'center';
        this.style.lineHeight = this.button_size;
        this.style.color = 'white';
        this.style.marginLeft = `calc(calc(calc(100% - ${this.button_size} * 4)/ 4)/2)`
        this.style.marginRight = `calc(calc(calc(100% - ${this.button_size} * 4)/ 4)/2)`
        this.style.marginBottom = '10px';
        this.style.transition = 'all ease-in 0.3s';
        this.style.marginTop = '10px';
        this.style.userSelect = 'none';
    }

    connectedCallback(){
        this.CreateStructure();
        this.PreStyle();

        this.onclick = (e) => {
            var index = e.target.modes.indexOf(e.target.getAttribute('toggled'))
            if(index == e.target.modes.length -1){
                e.target.setAttribute('toggled', e.target.modes[0])
                e.target.innerHTML = e.target.icons[0]
                e.target.style.background = e.target.colors[0];
            }else{
                var new_index = index + 1;
                e.target.setAttribute('toggled', this.modes[new_index])
                e.target.innerHTML = e.target.icons[new_index]
                e.target.style.background = e.target.colors[new_index];
            }
            this._onclick(e);
        };
    }
}

window.customElements.define('icon-button', IconButton);