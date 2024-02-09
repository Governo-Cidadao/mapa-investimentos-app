import { AfterViewInit, Component } from '@angular/core';
import { faArrowsAlt } from '@fortawesome/free-solid-svg-icons';
import L, { LatLngExpression } from 'leaflet';
import { MapService } from '../../service/map.service';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrl: './controller.component.css'
})
export class ControllerComponent implements AfterViewInit {
  map: L.Map | null = null;
  intervalId: any;
  faArrowsAlt = faArrowsAlt;
  rect: any;
  constructor(private mapService: MapService) {

  }

  ngAfterViewInit(): void {
    this.map = this.mapService.getMap()
    this.arrastarController()

  }

  movimentacao(long: number, lat: number, movimentation: boolean): void {
    if (movimentation) {
      this.intervalId = setInterval(() => {
        this.mover(long, lat);
      }, 100);
    }
    else {
      clearInterval(this.intervalId);
    }
  }

  mover(long: number, lat: number): void {
    let centro = this.map?.getCenter();
    if (centro) {
      let novo_centro = L.latLng(centro.lat + lat, centro.lng + long);
      this.map?.setView(novo_centro);
    }
  }

  centralizarMapa(): void {
    const initialCoordinates: LatLngExpression = [-5.844865661075205, -36.56710587301696]
    const initialZoomLevel = 8.8;
    this.map?.setView(initialCoordinates, initialZoomLevel);
  }

  zoomIn(): void {
    this.map?.zoomIn(0.5)
  }

  zoomOut(): void {
    this.map?.zoomOut(0.5)
  }

  arrastarController(): void {
    const itemArrastavel: HTMLElement | null = document.querySelector<HTMLElement>(".arrastavel");
    let divArrastavel: HTMLElement | null;
    let difX = 0;
    let difY = 0;
    itemArrastavel?.addEventListener("mousedown", (e) => {
      itemArrastavel.style.cursor = "grabbing";
      divArrastavel = document.querySelector<HTMLElement>('.container-controller')
      this.rect = divArrastavel?.getBoundingClientRect();
      if (this.rect) {
        difX = e.clientX - this.rect.left;
        difY = e.clientY - this.rect.top;
      }
    });

    itemArrastavel?.addEventListener("touchstart", (e) => {
      itemArrastavel.style.cursor = "grabbing";
      divArrastavel = document.querySelector('.container-controller')
      difX = e.touches[0].clientX - this.rect.left;
      difY = e.touches[0].clientY - this.rect.top;
    });


    document.addEventListener("mousemove", (e) => {
      if (divArrastavel) {
        divArrastavel.style.left = (e.clientX - difX) + "px";
        divArrastavel.style.top = (e.clientY - difY) + "px";
      }
    });

    document.addEventListener("touchmove", (e) => {
      if (divArrastavel) {
        divArrastavel.style.left = (e.touches[0].clientX - difX) + "px";
        divArrastavel.style.top = (e.touches[0].clientY - difY) + "px";
      }
    });

    document.addEventListener("mouseup", () => {
      if (divArrastavel && itemArrastavel) {
        itemArrastavel.style.cursor = "grab";
        divArrastavel = null;
      }
    });

    document.addEventListener("touchend", () => {
      if (divArrastavel && itemArrastavel) {
        itemArrastavel.style.cursor = "grab";
        divArrastavel = null;
      }
    });
  }
}
