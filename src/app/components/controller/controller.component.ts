import { AfterViewInit, Component, OnInit } from '@angular/core';
import L, { LatLngExpression } from 'leaflet';
import { MapService } from '../../service/map.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css'
})
export class ControllerComponent implements AfterViewInit {
  map: L.Map | null = null;
  intervalId: any;
  constructor(private mapService: MapService) {

  }

  ngAfterViewInit(): void {
    this.map = this.mapService.getMap()

  }

  movimentacao(long: number, lat: number, movimentation: boolean) {
    if (movimentation) {
      this.intervalId = setInterval(() => {
        this.mover(long, lat);
      }, 100);
    }
    else {
      clearInterval(this.intervalId);
    }
  }

  mover(long: number, lat: number) {
    let centro = this.map?.getCenter();
    if (centro) {
      let novo_centro = L.latLng(centro.lat + lat, centro.lng + long);
      this.map?.setView(novo_centro);
    } 
  }
  centralizarMapa() {
    const initialCoordinates: LatLngExpression = [-5.844865661075205, -36.56710587301696]
    const initialZoomLevel = 8.8;
    this.map?.setView(initialCoordinates, initialZoomLevel);
  }
  zoomIn() {
    this.map?.zoomIn(0.5)
  }
  zoomOut() {
    this.map?.zoomOut(0.5)
  }

}
