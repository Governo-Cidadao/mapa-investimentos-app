import { Injectable } from '@angular/core';
import { Map } from 'leaflet';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: L.Map;

  setMap(map: Map): void {
    this.map = map;
  }

  getMap(): Map {
    return this.map;
  }
}
