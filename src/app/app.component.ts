import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/Storage';

//import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private storage:Storage) {
    //this.storage = storage;
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.storage.get('agent').then((agent) => {
        if(agent){
          console.log('Got it');
          this.rootPage ='HomePage';
        }
        else{
          console.log('OOoooops')
          this.rootPage = 'LoginPage';
        }
    });
    });
  }
}

