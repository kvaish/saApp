import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import * as io from 'socket.io-client'

/*
  Generated class for the LocationTrackerProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class LocationTrackerProvider {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  socket = io('http://54.174.46.232:3000',{transports: ['websocket', 'polling', 'flashsocket']});
  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, public geolocation: Geolocation) {
 
  }
 
  startTracking(agent) { 
    let config = {
      desiredAccuracy: 0,
      stationaryRadius: 2,
      distanceFilter: 1, 
      interval: 2000 
    };
  
    this.backgroundGeolocation.configure(config).subscribe((location) => {
  
      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
  
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
      });
  
    }, (err) => {
  
      console.log(err);
  
    });
  
    // Turn ON the background-geolocation system.
    this.backgroundGeolocation.start();
  
  
    // Foreground Tracking
  
    let options = {
      frequency: 3000, 
      enableHighAccuracy: true
    };
    
    this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
    
      console.log(position);
    
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.socket.emit('agentlocation',{sa: agent, lat: this.lat, lng : this.lng})
      })
    
    });
  }
 
  stopTracking() {
    console.log('stopTracking');
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
  }

}
