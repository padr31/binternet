import { Component } from '@angular/core';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder,NativeGeocoderOptions} from '@ionic-native/native-geocoder/ngx';
 
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
  CameraPosition
} from "@ionic-native/google-maps";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  geoLatitude: number;
  geoLongitude: number;
  geoAccuracy:number;
  geoAddress: string;
  map: GoogleMap;
  loading: any;

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  constructor(
    private geolocation: Geolocation,
    private platform: Platform,
    public loadingController: LoadingController,
    private nativeGeocoder: NativeGeocoder,
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
/*getGeolocation(){
    this.geolocation.getCurrentPosition().then((resp) => {
      this.geoLatitude = resp.coords.latitude;
      this.geoLongitude = resp.coords.longitude; 
      this.geoAccuracy = resp.coords.accuracy; 
      this.getGeoencoder(this.geoLatitude,this.geoLongitude);
     }).catch((error) => {
       alert('Error getting location'+ JSON.stringify(error));
     });
  }

  getGeoencoder(latitude,longitude){
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
    .then((result: NativeGeocoderReverseResult[]) => {
      this.geoAddress = this.generateAddress(result[0]);
    })
    .catch((error: any) => {
      alert('Error getting location'+ JSON.stringify(error));
    });
  }*/
}
