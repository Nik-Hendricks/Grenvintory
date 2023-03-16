//1-4-23 Nik Hendricks 
import API from '/js/API.js'
import Window from '/components/Window.js'
import Table from '/components/Table.js'
import UserTabBar from '/components/UserTabBar.js'
import UserControls from '/components/UserControls.js'
import UserManager from '/js/UserManager.js'
import CustomInput from '/components/CustomInput.js'
import Dispatcher from '/js/Dispatcher.js'

class Grenvintory{
    constructor(props){
            window.UserManager.load().then(users => {
                this.admin_mode = 'false';
                this.left_view = document.createElement('div');
                this.right_view = document.createElement('div');

                this.left_view.style.width = 'calc(100% - 250px)';
                this.left_view.style.float = 'left';
                this.left_view.style.display = 'block';
                this.left_view.style.position = 'absolute'
                this.left_view.style.left = '0px'
                this.left_view.style.top = '35px'
                this.left_view.style.bottom = '0px'

                this.right_view.style.width = '250px';
                this.right_view.style.display = 'block';
                this.right_view.style.height = 'calc(100% - 35px)';
                this.right_view.style.position = 'absolute'
                this.right_view.style.right = '0px'
                this.right_view.style.overflowX = 'scroll'


                this.createMainView(users); 
                //window.API.create_user('Kathy', 'cockrum', 'kathy', 'pass', 1)
                //window.API.create_user('Ron',  'Grennan',  'Ron', '6588', 1)
                window.Dispatcher.dispatch('LOAD')
            });        
    }

    createMainView(users){
        window.Table = new Table({table_name:'inventory', hasFormulaInput:true});
        window.UserControls = new UserControls();
        window.UserTabBar = new UserTabBar();
        this.left_view.append(window.Table);
        this.right_view.append(window.UserControls)
        document.getElementById('maincontent').append(window.UserTabBar, this.left_view, this.right_view);   
    }

    window(data){
        var w = new Window();
        return w.create(data);
    }
}


var maincontent = document.getElementById('maincontent')
window.app = new Grenvintory({maincontent:maincontent, margin:40});
console.log(window.app)