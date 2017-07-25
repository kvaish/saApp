import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the RegisterPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  user:{
    email:string,
    password:string
  }
  createSuccess = false;
  name:string;
  email:string;
  password:string;
  phone:number;
  address:string;
  constructor(private nav: NavController, private auth: AuthServiceProvider, private alertCtrl: AlertController) { }
 
  register(){
    const newUser = {
      name:this.name,
      email:this.email,
      password:this.password,
      phone:this.phone,
      address:this.address
    }
    this.auth.register(newUser).subscribe((user)=>{
      if(user == 'done'){
        let text  = 'Congratulations! Time to Login now.';
        let title = 'Registered Successfully';
        this.showPopup(title, text);
        this.nav.setRoot('LoginPage');
      }
      else{
        this.showPopup('Failed','Please Try Again!');
      }
    });
  }
 
  showPopup(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
        {
          text: 'OK',
          handler: data => {
            if (this.createSuccess) {
              this.nav.popToRoot();
            }
          }
        }
      ]
    });
    alert.present();
  }

}
