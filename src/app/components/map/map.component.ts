import { Component } from '@angular/core';
import L, { Map, latLng, tileLayer } from 'leaflet';
import { EstadoService } from '../../service/estado.service';
import { TerritorioService } from '../../service/territorio.service';
import { MiniMap } from 'leaflet-control-mini-map';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  INITIAL_COORD = [-5.844865661075205, -36.56710587301696];
  baseMapURl: string = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  layers: L.LayerGroup = new L.LayerGroup();
  layerControl!: L.Control.Layers;

  options = {
    layers: [
      tileLayer(this.baseMapURl, { maxZoom: 12, attribution: '© contributors: @joabesamuell, @_ig0rdias, @celilimaf, @rodmatth, @jonas.ssilva' })
    ],
    zoom: 8,
    attributionControl: false,
    zoomControl: true,
    minZoom: 8,
    maxZoom: 12,
    zoomSnap: 0.10,
    closePopupOnClick: false,
    doubleClickZoom: false,
    center: latLng(this.INITIAL_COORD[0], this.INITIAL_COORD[1])
  };

  constructor(
    private estadoService: EstadoService,
    private territorioService: TerritorioService
  ) { }

  onMapReady(map: Map) {
    this.initializeLayerControl(map);
    this.initializeMiniMap(map);
    this.getBrazilLayer();
    this.getTerritorioLayer();
  }

  initializeLayerControl(map: Map) {
    this.layerControl = L.control.layers({}).addTo(map);
  }

  initializeMiniMap(map: Map) {
    const baseMinimap = L.tileLayer(this.baseMapURl, {
      maxZoom: 30,
    })

    new MiniMap(baseMinimap, {
      toggleDisplay: true
    }).addTo(map);
  }

  getBrazilLayer() {
    const brazilStyle = {
      "color": "#111",
      "weight": 0,
      "opacity": 1
    };

    this.estadoService.findAll()
      .subscribe(response => {
        new L.GeoJSON(response, { style: brazilStyle }).addTo(this.layers);
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
        const territorio = new L.GeoJSON(response, { style: whiteBackground })
          .addTo(this.layers);
        this.layerControl.addOverlay(territorio, "Territórios");
      })
  }
}
