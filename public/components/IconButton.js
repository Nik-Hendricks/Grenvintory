export default class IconButton extends HTMLElement{
    constructor(icons, onclick, toggled, modes, colors){
        super();
        this.icons = icons;
        this.modes = modes;
        this.colors = colors;
        this._onclick = onclick;
        this.toggled = toggled;
        this.button_size = '40px'
        this.button_count = 5;
    }

    connectedCallback(){
        console.log(`toggled ${this.toggled}`)
            this.CreateStructure();
            this.PreStyle();
            this.SetupEvents();    
            this.onclick = (e) => {
                var index = this.modes.indexOf(this.getAttribute('toggled'))
                if(index == this.modes.length -1){
                    this.setAttribute('toggled', this.modes[0])
                }else{
                    var new_index = index + 1;
                    this.setAttribute('toggled', this.modes[new_index])
                }
                this._onclick(e);
                window.Dispatcher.dispatch('CONTROL_UPDATE')
            };
    }

    CreateStructure(){
        this.setAttribute('toggled', this.toggled)
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
        this.style.marginLeft = `calc(calc(calc(100% - ${this.button_size} * ${this.button_count})/ ${this.button_count})/2)`
        this.style.marginRight = `calc(calc(calc(100% - ${this.button_size} * ${this.button_count})/ ${this.button_count})/2)`
        this.style.marginBottom = '10px';
        this.style.transition = 'all ease-in 0.3s';
        this.style.marginTop = '10px';
        this.style.userSelect = 'none';
    }

    SetupEvents(){
        window.Dispatcher.on('CONTROL_UPDATE', () => {
            var index = this.modes.indexOf(this.getAttribute('toggled'))
            this.innerHTML = this.icons[index]
            this.style.background = this.colors[index];
        })
    }
}



window.customElements.define('icon-button', IconButton);