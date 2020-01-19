import { Component } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions,NativeGeocoderResult} from '@ionic-native/native-geocoder/ngx';
 
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker,
  MarkerOptions,
  GoogleMapsAnimation,
  MyLocation,
  CameraPosition,
  HtmlInfoWindow
} from "@ionic-native/google-maps";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  geoLatitude: number;
  geoLongitude: number;
  geoLocationLat: any;
  geoLocationLng: any;
  geoAccuracy:number;
  geoAddress: string;
  map: GoogleMap;
  loading: any;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    // private geolocation: Geolocation,
    private platform: Platform,
    public loadingController: LoadingController,
    // private nativeGeocoder: NativeGeocoder,
  ) {
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }
  loadMap() {

    /// Create map
    this.map = GoogleMaps.create('map_canvas');

    /// Go to my location
    this.onButtonClick();
  }
  async onButtonClick() {

    /// Clear map of all the markers
    this.map.clear();

    /// Display loading notification
    this.loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await this.loading.present();

    /// Get the location
    this.getLocation();

    /// Get marker info

    /// Add marker + data
    //this.addCluster();
  }


  async getLocation(){

    this.setDefaultMarkers();

    // Get my current location
    this.map.getMyLocation().then((location: MyLocation) => {

      // Add a "You are here" marker
      let marker: Marker = this.map.addMarkerSync({
        title: 'You are here!',
        ///snippet: 'This plugin is awesome!',
        position: location.latLng,
      });

      // Animate the map camera to the location
      this.map.animateCamera({
        target: location.latLng,
        zoom: 18,
        duration: 1200,
      });

      ///Dismiss loading notification
      this.loading.dismiss();
    });
  }

  setDefaultMarkers() {
    let ls = window.localStorage;
    let arr = [{"lat":52.20506323635333,"lng":0.1201924681663513},{"lat":52.20548978938501,"lng":0.11858213692903519},{"lat":52.204643459791335,"lng":0.11828273534774782},{"lat":52.20623686373032,"lng":0.11941663920879363},{"lat":52.20379403194475,"lng":0.12135755270719527},{"lat":52.20324561429087,"lng":0.11907096952199936}]

    let htmlInfoWindow = new HtmlInfoWindow();

    let frame: HTMLElement = document.createElement('div');
    frame.innerHTML = [
      '<h3>Amazing trash!</h3>',
    ].join("");
   
    htmlInfoWindow.setContent(frame, {width: "250px", height: "100px"});
    
    arr.map(marker => {
      const { lat, lng } = marker;
      let myMarker: Marker  = this.map.addMarkerSync({
        //title: 'This is an amazing trash',
        position: {
          lat,
          lng
        },
        icon: {
          url: 'assets/icon/trash.png',
          size: {
            width: 32,
            height: 32
          }
        }
      });
       myMarker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
         htmlInfoWindow.open(myMarker);
       });
    
    });
  }

  // addMarker() {
  //   let target = this.map.getCameraTarget();
  //   this.geoLocationLat = target.lat;
  //   this.geoLocationLng = target.lng;

  //   this.map.addMarker({
  //       position: {
  //         lat: this.geoLocationLat,
  //         lng: this.geoLocationLng
  //       },
  //       icon: this.markerIcon
  //   });


    // let ls = window.localStorage;
    // let arr = []
    // if(!ls.getItem('markers')) {
    //   arr = [{lat: this.geoLocationLat, lng: this.geoLocationLng}]
    // } else {
    //   arr = [ ...JSON.parse(ls.getItem('markers')), {lat: this.geoLocationLat, lng: this.geoLocationLng}]
    // }
    // ls.setItem('markers', JSON.stringify(arr))
    // alert(ls.getItem('markers'))
  // }
}
  // getGeolocation(){
  //   this.geolocation.getCurrentPosition().then((resp) => {
  //     this.geoLatitude = resp.coords.latitude;
  //     this.geoLongitude = resp.coords.longitude; 
  //     this.geoAccuracy = resp.coords.accuracy; 
  //     this.getGeoencoder(this.geoLatitude,this.geoLongitude);
  //    }).catch((error) => {
  //      alert('Error getting location'+ JSON.stringify(error));
  //    });
  // }

  // getGeoencoder(latitude,longitude){
  //   this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
  //   .then((result: NativeGeocoderResult[]) => {
  //     this.geoAddress = this.generateAddress(result[0]);
  //   })
  //   .catch((error: any) => {
  //     alert('Error getting location'+ JSON.stringify(error));
  //   });
  // }