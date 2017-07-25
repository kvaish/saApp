import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/Storage';
import { HttpModule } from '@angular/http';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { GoogleMaps} from '@ionic-native/google-maps';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
 
import { MyApp } from './app.component';
//import { HomePage } from '../pages/home/home';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { MapServiceProvider } from '../providers/map-service/map-service';
import { GeocoderServiceProvider } from '../providers/geocoder-service/geocoder-service';

import { RequestsProvider } from '../providers/requests/requests';

@NgModule({
  declarations: [
    MyApp,
    
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    IonicStorageModule,
    MapServiceProvider,
    GeocoderServiceProvider,
    Diagnostic,
    LocationAccuracy,
    GoogleMaps,
    RequestsProvider,
    BackgroundGeolocation
  ]
})
export class AppModule {}
