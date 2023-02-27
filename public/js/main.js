//1-4-23 Nik Hendricks 
import API from '/js/API.js'
import Window from '/components/Window.js'
import TableData from '/components/TableData.js'
import UserTabBar from '/components/UserTabBar.js'
import UserControls from '/components/UserControls.js'
import UserManager from '/js/UserManager.js'

class Grenvintory{
    constructor(props){
            window.UserManager.load().then(users => {
                this.left_view = document.createElement('div');
                this.middle_view = document.createElement('div');
                this.right_view = document.createElement('div');

                this.left_view.style.width = '50%';
                this.left_view.style.float = 'left';
                this.left_view.style.display = 'block';
                this.left_view.style.height = 'calc(100% - 58px)';

                this.right_view.style.width = '30%';
                this.right_view.style.float = 'right';
                this.right_view.style.display = 'block';
                this.right_view.style.height = 'calc(100% - 58px)';

                this.middle_view.style.width = '20%';
                this.middle_view.style.float = 'left';
                this.middle_view.style.display = 'block';
                this.middle_view.style.height = 'calc(100% - 58px)';


                this.createMainView(users); 
            });        
    }

    createMainView(users){
        window.UserControls = new UserControls();
        window.UserTabBar = new UserTabBar(users);
        window.TableData = new TableData({table_name:'inventory'});
        this.left_view.append(window.TableData);
        this.middle_view.append(window.UserControls)
        document.getElementById('maincontent').append(window.UserTabBar, this.left_view, this.middle_view, this.right_view);   
    }

    window(data){
        var w = new Window();
        return w.create(data);
    }
}


var maincontent = document.getElementById('maincontent')
var app = new Grenvintory({maincontent:maincontent, margin:40});
console.log(app)