export default class JsonEditor extends HTMLElement{
    constructor(){
        super();
        this.innerHTML = `<div class="json-editor-header"></div><div class="json-editor-container"></div><div class="json-editor-footer"><i class="fas fa-download" id="json-editor-save"></i><i class="fas fa-code"></i></div>`
        this._json = {};
        this.load_url = this.getAttribute('load-url');

        
        this.input = this.getElementsByClassName('json-editor-container')[0]
        return this;
    }

    connectedCallback(){
        //this.getRemoteJSON(this.load_url).then(res => {

            var res = {test: 'test', arr: [1,2,3], obj: {test: 'test', arr: [1,2,3,4]}}
            this.input.innerHTML = `<json-tab tab-width="0"></json-tab>{</br>`
            this._json = res
            this._iterate(0, this._json);
            this.getElementsByTagName('json-editor-save').onclick = () => {
                this._save();
            }
        //})

    }

    setJSON(json){
        if(typeof json == "string"){
            this._json = JSON.parse(json);
        }else{
            this._json = json;
        }
    }

    getRemoteJSON(url){
        return new Promise(resolve => {
            fetch(url)
            .then(response => response.json())
            .then((data) => {
                resolve(data)
            })
        })
    }

    postRemoteJSON(url){
        return new Promise(resolve => {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(this.getJSON()),
                headers: {'Content-Type': 'application/json'}
            }).then(res => res.json())
            .then(json => resolve(json));
      })
    }

    getJSON(){
        var json_text = this.input.text().slice(0, -1)
        return JSON.parse(this._remove_trailing_commas(json_text))
    }

    _remove_trailing_commas(json_string){
        var regex = /\,(?!\s*?[\{\[\"\'\w])/g;
        return json_string.replace(regex, '');
    }

    _save(){
        console.log("SAVE")
        console.log(this.getJSON())
        this.postRemoteJSON(this.load_url).then(res => {
            console.log(res )
        })

    }

    _post_to_api(url){

    }

    _iterate(_tab, raw_json){
        var tab = _tab;
        tab++;
   

        for(var key1 in raw_json){
            var data_type = typeof raw_json[key1];
            var d = String(raw_json[key1]).toString();

            var html = {
                "object_or_array" :    `<json-tab tab-width="${tab}"></json-tab>
                                        <div class="json-editor-input-container-2 -je-${data_type}">
                                            "<span class="-je-key">${key1}</span>" :{
                                        </div></br>`,

                "regular":             `<div class="json-editor-row">
                                            <json-tab tab-width="${tab}"></json-tab>
                                            <div class="json-editor-input-container-2">
                                                "<span class="-je-key">${key1}</span>" : 
                                                "<div class="json-editor-input -je-${data_type}" spellcheck="false" contenteditable="true">${d}</div>", 
                                            </div>
                                        </div>`,

                "trailing":             `<json-tab tab-width="${tab -1}"></json-tab>},</br>`
            }

            if(data_type == "object" || data_type == "array"){
                this.input.innerHTML += html["object_or_array"]
                this._iterate(tab, raw_json[key1])
            }else{
                this.input.innerHTML += html["regular"]
            }
        }
        
        this.input.innerHTML += `<json-tab tab-width="${tab -1}"></json-tab>},</br>`

    }
}

class Tab extends HTMLElement{
    constructor(){
        super();
        this.tab_width = this.getAttribute('tab-width')

    }

    connectedCallback(){
        for(var i = 0; i < this.tab_width; i++){
            this.innerHTML += `<span></span>`
        }
    }
}

window.customElements.define('json-tab', Tab);
window.customElements.define('json-editor', JsonEditor);