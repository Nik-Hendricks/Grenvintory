import CustomInput from '/components/CustomInput.js'
import Prompt from '/components/Prompt.js'

export default class DataManager extends HTMLElement{
    constructor(){    
        super();
        this.style.display = 'inline-block';
        this.style.background = 'var(--window-color-1)';
        this.style.borderRadius = '5px';
        this.style.height = 'auto';
        this.style.color = 'white';
        this.style.paddingTop = '5px'
        this.innerHTML = '<p style="text-align:center; margin:0px;">Data Manager</p>';
        return this;
    }

    PreStyle(){

    }

    CreateStructure(){
        this.content_container = document.createElement('div');
        this.switch = new CustomInput({type: 'switch', text1: 'Import', text2: 'Export', icon1:'import_export', icon2:'import_export', width:'100%', height:'30px', margin:'5px'})
        this.switch.addEventListener('change', (ev) => {
            this.UpdateState();
        })
        this.append(this.switch, this.content_container);
        this.UpdateState();
    }

    UpdateState(){
        this.content_container.innerHTML = '';
        if(this.switch.value == true){
            this.ImportView();
        }else{
            this.ExportView();
        }
    }


    ImportView(){
        this.select_file_button = new CustomInput({type: 'upload', text: 'Select File', background_color:'#5352ed', icon:'description', width:'100%', height:'30px', margin:'5px'})
        this.import_button = new CustomInput({type: 'button', text: 'Import', background_color:'#6c5ce7', icon:'upload', width:'100%', height:'30px', margin:'5px'})
        this.file_container = document.createElement('div');

        this.select_file_button.onchange = (ev) => {
            var files_to_import = [];
            for(var i = 0; i < ev.target.files.length; i++){
                var file = ev.target.files[i];
                var filetype = file.name.split('.')[1];
                if(filetype == 'xlsx'){
                    var reader = new FileReader();
                    reader.readAsText(file);
                    reader.onload = (ev) => {
                        this.file_container.append(this.FileItem(file))
                        console.log(ev.target.result)
                    }
                }
            }
        }

        this.import_button.onclick = (ev) => {
            console.log(ev)
        }
        this.content_container.append(this.select_file_button ,this.file_container, this.import_button);
    }

    FileItem(f){
        var el = document.createElement('div')
        var i = document.createElement('i')
        var p = document.createElement('p')

        var s = '80px'

        el.style.position = 'relative';
        el.style.float = 'left'
        el.style.borderRadius = '5px';
        el.style.height = s;
        el.style.width = s;
        el.style.background = '#16a085';
        el.style.margin = '5px';

        i.style.width = '100%';
        i.style.height = '100%';
        i.style.textAlign = 'center';
        i.style.lineHeight = `calc(${s} - 20px)`;
        i.style.fontSize = `calc(${s} - 30px)`;

        i.classList.add('fas', 'fa-file-excel')
        p.style.position = 'absolute';
        p.style.float = 'left'
        p.style.bottom = '0px';
        p.style.height = '12px';
        p.style.fontSize = '12px';
        p.style.margin = '5px'
        p.style.width = 'calc(100% - 10px)';
        p.style.textAlign = 'center';
        p.style.overflow = 'hidden';
        p.style.textOverflow = 'ellipsis';
        p.style.color = 'white';
        
        p.innerHTML = f.name;

        el.append(i, p)
        return el;
    }

    ExportView(){
        this.export_button = new CustomInput({type: 'button', text: 'Export', background_color:'#6c5ce7', icon:'download', width:'100%', height:'30px', margin:'5px'})
        this.filename_input = new CustomInput({type: 'text', placeholder: 'Filename', icon:'download', width:'100%', height:'30px', margin:'5px'})


        this.export_button.onclick = (ev) => {
            var filename = this.filename_input.value;
            window.API.export_xlsx({filename: filename}).then(res => {
                console.log(res)
                var p = new Prompt({title: 'Error', error:true, text: res.error, icon: 'check_circle'})

                p.init();
            })
        }

        this.content_container.append(this.filename_input, this.export_button);
    }

    connectedCallback(){
        this.CreateStructure();
        this.PreStyle();
    }
}
window.customElements.define('data-manager', DataManager);