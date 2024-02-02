import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { KeyboardComponent } from '../keyboard/keyboard.component';



@NgModule({
  declarations: [
    KeyboardComponent
  ],
  imports: [
    CommonModule,
    LeafletModule
  ]
})
export class MapModule { }
