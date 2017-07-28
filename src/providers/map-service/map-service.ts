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

  map: any;
  markers = []
  bounds = new google.maps.LatLngBounds()
  lastOpenedInfoWindow:any;
  centerControlDiv
  centerControl
  directionsService = new google.maps.DirectionsService;
  public  directionsDisplay = new google.maps.DirectionsRenderer;

  constructor(public http: Http, public geocodeService: GeocoderServiceProvider) {
  }

  public loadMap(mapEle){
    let location = new LatLng(-34.9290,138.6010);
    const styleArray = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            {visibility: 'off'}
          ]
        }
      ];

    this.map = new google.maps.Map(mapEle ,{
      zoom:17,
      center:location
    });
    this.centerControlDiv = document.createElement('div');
    
    this.centerControl = new this.goBack(this.centerControlDiv, this.map);
    this.centerControlDiv.index = 1;
    this.directionsDisplay.setMap(this.map);
    console.log(this.directionsDisplay);
   
    
    return this.map;
  }

  goBack(controlDiv, map) {

        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.margin = '10px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Back';
        controlDiv.appendChild(controlUI);

        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '22px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Back';
        controlUI.appendChild(controlText);
        
      }

  addmarker(request){
      var lat = request.address.geometry.coordinates.lat;
      var lng = request.address.geometry.coordinates.lng;
      //let geocoder = new google.maps.Geocoder;
      var  title = '<b>' + 'Client Name : ' + '</b>' + request.clientid + '<br>' +
                   '<b>' + 'Service Type : ' + '</b>' + request.reqtype + '<br>' +
                   '<b>' + 'Service Status : ' + '</b>' + request.status + '<br>' +
                   '<b>' + 'Date of Service : ' + '</b>' + request.date + '<br>' ;
      
      
      let infoWindow = new google.maps.InfoWindow();

      let marker = new google.maps.Marker({
        'position':{'lat':lat,'lng':lng},
        'zoom':17,
        'map':this.map,
        'draggable':false,
        'title':title
      });

      this.bounds.extend(marker.position);

      marker.addListener('click',()=>{
        this.populateInfoWindow(marker,infoWindow);
      }); 
      this.markers.push(marker);
  }

  populateInfoWindow(marker,infoWindow){
    console.log("Title of the marker "+marker.title);
    //if(infoWindow.marker!=marker){
      
      infoWindow.marker = marker;
      let point = marker.getPosition()
      console.log(point)
      this.geocodeService.addressForlatLng(point.lat(),point.lng())
        .subscribe((address: string) => {
         
          this.closeLastOpenedInfoWindow();
          infoWindow.setContent('<div>' + marker.title + '<b>Address :</b>' +address + '</div>');
          infoWindow.open(this.map,marker);
          this.lastOpenedInfoWindow = infoWindow;
        }, (error) => {
          console.error(error);
      });
    //}
  }

  closeLastOpenedInfoWindow() {
    if (this.lastOpenedInfoWindow) {
        this.lastOpenedInfoWindow.close();
    }
  }

  calculateAndDisplayRoute(start, end) {
    var self = this
    return this.directionsService.route({
      origin: start,
      destination: end,
      travelMode: 'DRIVING',
      provideRouteAlternatives: true
    }, (response, status) => {
      if (status === 'OK') {
        this.clearMarkers()
        this.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(this.centerControlDiv);
        this.directionsDisplay.setMap(this.map)
        this.directionsDisplay.setDirections(response);
        this.centerControlDiv.addEventListener('click', function(){
          console.log(self.directionsDisplay);
          self.map.controls[google.maps.ControlPosition.TOP_RIGHT].clear()
          self.directionsDisplay.setMap(null);
          self.setMapOnAll(self.map);
        });
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
   
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }


}
