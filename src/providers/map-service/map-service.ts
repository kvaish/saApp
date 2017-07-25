import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GoogleMap, GoogleMapsEvent, LatLng, LatLngBounds, MarkerOptions, Marker, GoogleMapsAnimation,CameraPosition } from '@ionic-native/google-maps';
import { GeocoderServiceProvider } from '../geocoder-service/geocoder-service';
/*
  Generated class for the MapServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
declare var google: any

@Injectable()
export class MapServiceProvider {

  map: GoogleMap;
  markers: any
  //bounds: LatLngBounds;
  lastOpenedInfoWindow:any;
  constructor(public http: Http, public geocodeService: GeocoderServiceProvider) {
    console.log('Hello MapServiceProvider Provider');
  }

  public loadMap(){
    let location = new LatLng(-34.9290,138.6010);
    this.map = new GoogleMap(
      'map', {
        'center': location,
        'backgroundColor': 'white',
        'controls': {
        'compass': true,
        'myLocationButton': true,
        'indoorPicker': true,
      },
      'camera': {
        'latLng': location,
        'tilt': 30,
        'zoom': 17,
        'bearing': 50
      },
      'padding': {
        'top': 70,
      }
    });
    //this.map.addGroundOverlay(this.bounds);
    return this.map;
  }

  addmarker(request){
      var lat = request.address.geometry.coordinates.lat;
      var lng = request.address.geometry.coordinates.lng;
      let geocoder = new google.maps.Geocoder;
      var  title = '<b>' + 'Client Name : ' + '</b>' + request.clientid + '<br>' +
                   '<b>' + 'Service Type : ' + '</b>' + request.reqtype + '<br>' +
                   '<b>' + 'Service Status : ' + '</b>' + request.status + '<br>' +
                   '<b>' + 'Date of Service : ' + '</b>' + request.date + '<br>' ;
      
      
      let infoWindow = new google.maps.InfoWindow();

      let marker = new google.maps.Marker({
        'position':{'lat':lat,'lng':lng},
        'zoom':15,
        'map':this.map,
        'draggable':false,
        'title':title
      });

      //this.bounds.extend(marker.position);

      marker.addListener('click',()=>{
        this.populateInfoWindow(marker,infoWindow);
      }); 
      //this.markers.push(marker);
      //return this.markers
  }

  populateInfoWindow(marker,infoWindow){
    console.log("Title of the marker "+marker.title);
    if(infoWindow.marker!=marker){
      
      infoWindow.marker = marker;
      let point = marker.getPosition()
      this.geocodeService.addressForlatLng(point.lat(),point.lng())
        .subscribe((address: string) => {
         
          this.closeLastOpenedInfoWindow();
          infoWindow.setContent('<div>' + marker.title + '<b>Address :</b>' +address + '</div>');
          infoWindow.open(this.map,marker);
          this.lastOpenedInfoWindow = infoWindow;
        }, (error) => {
          //alert(error);
          console.error(error);
      });
    }
  }

  closeLastOpenedInfoWindow() {
    if (this.lastOpenedInfoWindow) {
        this.lastOpenedInfoWindow.close();
    }
  }
}
