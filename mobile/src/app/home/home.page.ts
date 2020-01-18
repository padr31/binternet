import { Component } from '@angular/core';

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

  
  map: GoogleMap;
  constructor(
    
    private platform: Platform,
  ) {}

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }
  loadMap() {

    /// Create map
    this.map = GoogleMaps.create('map_canvas');

    /// Go to my location
  //  this.onButtonClick();
  }

}
