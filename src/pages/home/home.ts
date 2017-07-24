import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,IonicPage,MenuController, ViewController, Platform, Nav, AlertController, ToastController,ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AccountPage } from '../account/account';
import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/Storage';


@IonicPage() 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [
  ]
})
export class HomePage {

  @ViewChild(Nav) navMenu: Nav;
  @ViewChild('map') mapElement: ElementRef;
  view: any
  pages: Array<{title: string, component: any}>
  constructor( private viewCtrl: ViewController, private storage:Storage, private modalCtrl:ModalController, private toaster: ToastController, private alertCtrl: AlertController, private splashScreen: SplashScreen, private statusBar: StatusBar, private nav: NavController, private auth: AuthServiceProvider, private menu: MenuController, private platform: Platform) {}


  ngOnInit() {
    

    this.pages = [
        { title: 'Settings', component: SettingsPage },
        { title: 'Account', component: AccountPage }
      ];
    this.view = 'card'
  }

  public openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }
 
  menuOpened() {
    
  }

  menuClosed() {
    
  }

  logout(){
    this.storage.clear().then(() => {
      console.log('Keys have been cleared');
    });
    this.nav.setRoot('LoginPage');
    
  }

  
}
