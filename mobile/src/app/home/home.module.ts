import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { LoadingController, AlertController, Platform } from '@ionic/angular';
import { HomePage } from './home.page';
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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {


  map: GoogleMap;

  constructor(
    private platform: Platform,
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
   // this.onButtonClick();
  }

  /*async onButtonClick() {

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
    this.addCluster();
  }*/


}
