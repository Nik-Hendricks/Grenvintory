import {Helpers} from '/Engine/Helpers.js';
export default class ControlManager{
    constructor(){
        this.MouseHelper = {leftClick: 0, rightClick: 3}
        this.input_data = {mouse:[0, 0], scroll: 4, old_scroll:4}
        this.init();
    }

    init(callback){
        this.callback = callback
        window.addEventListener('keydown', () => {
            event.preventDefault();
            this.keyDownHandler(event);
        }, false);
        window.addEventListener('keyup', () => {
            event.preventDefault();
            this.keyUpHandler(event)
        }, false);
        window.addEventListener('mousedown', (ev) => {
            event.preventDefault();
            switch (event.which) {
                case 1:
                    this.input_data.leftClick = true;
                    break;
                case 2:
                    this.input_data.middleClick = true;
                    break;
                default:
                    break;
            }
        })
        window.addEventListener('mouseup', () => {
            event.preventDefault();
            switch (event.which) {
                case 1:
                    this.input_data.leftClick = false;
                    break;
                case 2:
                    this.input_data.middleClick = false;
                    break;
                default:
                    break;
            }
        })
        window.addEventListener('mousemove', () => {
            this.mouseMoveHandler(event);
        })
        window.addEventListener('wheel', () => {
            if(event.deltaY > 0){
                if(this.input_data.scroll >= 1){
                    this.input_data.scroll--
                }
                
            }else{
                this.input_data.scroll++
            }
            if(this.callback){
                this.callback(event)
            }
        })

        window.oncontextmenu = (event) => {
            event.preventDefault()
            Helpers.runOnce(() => {
                if(this.input_data.rightClick){
                    this.input_data.rightClick = false;
                }else{
                    this.input_data.rightClick = true;
                }  
                if(this.callback){
                    this.callback(event);
                }
            })()
        }
     
    }

    mouseUpHandler(event){
        if(event.button == this.MouseHelper.leftClick){
            this.input_data.mouseLeftPressed = false;
        }
        if(this.callback){
            this.callback(event)
        }
    }

    mouseDownHandler(event){
        if(event.button == this.MouseHelper.leftClick){
            this.input_data.mouseLeftPressed = true;
        }
        if(this.callback){
            this.callback(event)
        }
    }

    keyDownHandler(event){
        this.input_data[event.key.toLowerCase()] = true;
        if(this.callback){
            this.callback(event)
        }
    }

    keyUpHandler(event){
        this.input_data[event.key.toLowerCase()] = false;
        if(this.callback){
            this.callback(event)
        }
    }

    mouseMoveHandler(event){
        this.input_data.mouse = [event.x, event.y]
        if(this.callback){
            this.callback(event)
        }
    }

    debounce(func, timeout){
        let timer;
        return () => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, arguments)
            }, timeout)
        }
    }

    _debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
}
export default PlayerControls;