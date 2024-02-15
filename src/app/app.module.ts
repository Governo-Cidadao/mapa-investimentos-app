import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgOptimizedImage } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MapComponent } from './components/map/map.component';
import { ControllerComponent } from './components/controller/controller.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { VirtualKeyboardComponent } from './components/virtual-keyboard/virtual-keyboard.component';
import { ModalComponent } from './components/modal/modal.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { ControllLayerCustonComponent } from './components/controll-layer-custon/controll-layer-custon.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    HeaderComponent,
    ControllerComponent,
    VirtualKeyboardComponent,
    ModalComponent,
    CarouselComponent,
    ControllLayerCustonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    HttpClientModule,
    NgOptimizedImage,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
