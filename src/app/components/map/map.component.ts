import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';
import { EstadoService } from '../../service/estado.service';
import { TerritorioService } from '../../service/territorio.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit {
  map!: L.Map;
  layerControl!: L.Control;
  baseMapURl: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  INITIAL_COORD = [-5.844865661075205, -36.56710587301696]

  constructor(
    private estadoService: EstadoService,
    private territorioService: TerritorioService
  ) { }

  ngAfterViewInit(): void {
    this.initializeMap();
    this.getBrazilLayer();
    this.getTerritorioLayer();
  }

  initializeMap() {
    this.map = L.map('map', {
      center: new L.LatLng(this.INITIAL_COORD[0], this.INITIAL_COORD[1]),
      zoom: 8,
      zoomControl: true,
      minZoom: 8,
      maxZoom: 12,
      zoomSnap: 0.10,
      closePopupOnClick: false,
    });

    L.tileLayer(this.baseMapURl, {
      attribution: "© contributors: @joabesamuell, @_ig0rdias, @celilimaf, @rodmatth, @jonas.ssilva"
    }).addTo(this.map);

    this.map.attributionControl.setPrefix("");
    this.layerControl = L.control.layers({}).addTo(this.map);
  }

  getBrazilLayer() {
    const brazilStyle = {
      "color": "#111",
      "weight": 0,
      "opacity": 1
    };

    this.estadoService.findAll()
      .subscribe(response => {
        new L.GeoJSON(response, { style: brazilStyle }).addTo(this.map);
      });
  }

  getTerritorioLayer() {
    const whiteBackground = {
      "opacity": 1,
      "color": 'rgba(250,250,250,1.0)',
      "dashArray": '',
      "weight": 4.0,
      "fillColor": 'rgb(193,193,193)',
      "fillOpacity": 0.4,
      "interactive": true,
    };

    this.territorioService.findAll()
      .subscribe(response => {
        new L.GeoJSON(response, { style: whiteBackground }).addTo(this.map);
      })
  }
}
