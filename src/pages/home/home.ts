import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController,IonicPage,MenuController, ViewController, Platform, Nav, AlertController, ToastController,ModalController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
//import { AccountPage } from '../account/account';
//import { SettingsPage } from '../settings/settings';
import { Storage } from '@ionic/Storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { MapServiceProvider } from '../../providers/map-service/map-service';
import { GoogleMap, GoogleMapsEvent, LatLng } from '@ionic-native/google-maps';
import { RequestsProvider } from '../../providers/requests/requests';
import { GeocoderServiceProvider } from '../../providers/geocoder-service/geocoder-service';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';


declare var google:any

@IonicPage() 

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  entryComponents: [
  ]
})
export class HomePage {

  @ViewChild(Nav) navMenu: Nav;
  @ViewChild('map') mapEle: ElementRef;
  view: any
  pages: Array<{title: string, component: any}>
  requests: any;
  map: any
  agent:any
  constructor( private locationTrack: LocationTrackerProvider, private geocoder: GeocoderServiceProvider, private requestProvider: RequestsProvider, private mapService: MapServiceProvider, private viewCtrl: ViewController, private diagnostic: Diagnostic, private locationAccuracy: LocationAccuracy, private storage:Storage, private modalCtrl:ModalController, private toaster: ToastController, private alertCtrl: AlertController, private splashScreen: SplashScreen, private statusBar: StatusBar, private nav: NavController, private auth: AuthServiceProvider, private menu: MenuController, private platform: Platform) {}

  ionViewWillEnter(){
    if(this.view == 'card'){
      //this.map.setClickable(false)
    }
    else{
      //this.map.setClickable(true)
    }
  }
  ngOnInit() {
    this.view = 'map'
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest){
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
             () => {
               //alert('Request successful');
              
            },
        error =>{
            console.error("Request failed");
            if(error){
                // Android only
                console.error("error code="+error.code+"; error message="+error.message);
                if(error.code !== this.locationAccuracy.ERROR_USER_DISAGREED){
                    if(window.confirm("Failed to automatically set Location Mode to 'High Accuracy'. Would you like to switch to the Location Settings page and do this manually?")){
                        this.diagnostic.switchToLocationSettings();
                    }
                }
            }
        });
      }
    });
    this.map = this.mapService.loadMap(this.mapEle.nativeElement);
    
    this.storage.get('agent').then(name=>{
      this.agent = name
      this.start()
      this.requestProvider.getRequests("Active",name).subscribe(requests=>{
        this.requests=requests;
        for(var request in this.requests) { 
          //console.log(this.requests[request].address.geometry.coordinates.lat,this.requests[request].address.geometry.coordinates.lng)
          this.getLocation(this.requests[request]) 
          this.mapService.addmarker(this.requests[request])
          this.mapService.map.fitBounds(this.mapService.bounds);
        }  
      });     
    });
    
    this.pages = [
        { title: 'Settings', component: 'SettingsPage' },
        { title: 'Account', component: 'AccountPage' }
      ];
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
      //console.log('Keys have been cleared');
    });
    this.nav.setRoot('LoginPage');
    
  }

  getLocation(request){
    
    this.geocoder.addressForlatLng(request.address.geometry.coordinates.lat,request.address.geometry.coordinates.lng).subscribe((address: String) => {
      request.addressString= address;
    }, (error) => {
      //alert(error);
      console.error(error);
    });

  }

  editRequest(request){
    let alert = this.alertCtrl.create({
      title: 'Reject Request!!',
      subTitle: 'Are you sure you want to Reject this Service ?',
      buttons:[
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler:()=>{
            this.requestProvider.rejectRequest(request._id, request.state , 'Rejected').subscribe(success=>{
              var index = this.requests.indexOf(request,0);
              if(index > -1){
                this.requests.splice(index,-1);
                this.nav.setRoot(this.nav.getActive().component);
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  showRequestDetails(request){
    let start = new LatLng(this.locationTrack.lat, this.locationTrack.lng)
    start = new LatLng(28.535516, 77.391026)
    let end = new LatLng(request.address.geometry.coordinates.lat,request.address.geometry.coordinates.lng)
    console.log(start,end)
    this.mapService.calculateAndDisplayRoute(start, end)
    this.view = 'map'
  }
  
  start(){
    this.storage.get('agent').then((name)=>{
      this.locationTrack.startTracking(name)
    })
  }
 
  stop(){
    this.locationTrack.stopTracking();
  }
}
