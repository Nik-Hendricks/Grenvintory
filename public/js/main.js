//1-4-23 Nik Hendricks 
import API from '/js/API.js'
import Window from '/components/Window.js'
import TableData from '/components/TableData.js'
import UserTabBar from '/components/UserTabBar.js'
import UserControls from '/components/UserControls.js'
import UserManager from '/js/UserManager.js'
import CustomInput from '/components/CustomInput.js'

class Grenvintory{
    constructor(props){
            window.UserManager.load().then(users => {
                this.admin_mode = false;
                this.view_mode = 'edit';
                this.left_view = document.createElement('div');
                this.middle_view = document.createElement('div');
                this.right_view = document.createElement('div');

                this.left_view.style.width = '75%';
                this.left_view.style.float = 'left';
                this.left_view.style.display = 'block';
                this.left_view.style.position = 'absolute'
                this.left_view.style.left = '0px'
                this.left_view.style.top = '35px'
                this.left_view.style.bottom = '0px'

                this.right_view.style.width = '25%';
                this.right_view.style.display = 'block';
                this.right_view.style.height = 'calc(100% - 35px)';
                this.right_view.style.position = 'absolute'
                this.right_view.style.right = '0px'
                this.right_view.style.overflowX = 'scroll'


                this.createMainView(users); 
                //window.API.create_user('Kathy', 'cockrum', 'kathy', 'pass', 1)
                //window.API.create_user('Ron',  'Grennan',  'Ron', '6588', 1)
            });        
    }

    createMainView(users){
        window.UserControls = new UserControls();
        window.UserTabBar = new UserTabBar(users);
        window.TableData = new TableData({table_name:'inventory', hasFormulaInput:true});
        this.left_view.append(window.TableData);
        this.right_view.append(window.UserControls)
        document.getElementById('maincontent').append(window.UserTabBar, this.left_view, this.middle_view, this.right_view);   
    }

    window(data){
        var w = new Window();
        return w.create(data);
    }
}


var maincontent = document.getElementById('maincontent')
window.app = new Grenvintory({maincontent:maincontent, margin:40});
console.log(window.app)