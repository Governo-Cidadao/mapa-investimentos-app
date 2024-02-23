import { Component } from '@angular/core';
import L, { Map, latLng, tileLayer } from 'leaflet';
import { MiniMap } from 'leaflet-control-mini-map';
import { EstadoService } from '../../service/estado.service';
import { InvestimentosService } from '../../service/investimentos.service';
import { MapService } from '../../service/map.service';
import { TerritorioService } from '../../service/territorio.service';
import { FeatureUtils } from '../../utils/feature.utils';
import 'leaflet.control.layers.tree';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  INITIAL_COORD = [-5.844865661075205, -36.56710587301696];
  baseMapURl: string = 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}';
  layers: L.LayerGroup = new L.LayerGroup();
  layerControl!: L.Control.Layers;
  invest: any;

  options = {
    layers: [
      tileLayer(this.baseMapURl, { maxZoom: 12, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© contributors: @joabesamuell, @_ig0rdias, @celilimaf, @rodmatth, @jonas.ssilva' })
    ],
    zoom: 8,
    attributionControl: false,
    zoomControl: false,
    minZoom: 8,
    maxZoom: 12,
    zoomSnap: 0.10,
    closePopupOnClick: false,
    doubleClickZoom: false,
    center: latLng(this.INITIAL_COORD[0], this.INITIAL_COORD[1])
  };

  constructor(
    private mapService: MapService,
    private estadoService: EstadoService,
    private territorioService: TerritorioService,
    private investimentoService: InvestimentosService,
  ) { }

  onMapReady(map: Map): void {
    this.initializeLayerControl(map);
    this.initializeMiniMap(map);
    this.getBrazilLayer();
    this.getTerritorioLayer();
    this.getInvestimentosLayer();
    this.mapService.setMap(map);
    this.filtrarCamadasPorInput()
  }

  initializeLayerControl(map: Map): void {
    var osm = L. tileLayer(this.baseMapURl, { maxZoom: 12, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© contributors: @joabesamuell, @_ig0rdias, @celilimaf, @rodmatth, @jonas.ssilva' })

    var baseTree = {
      label: 'BaseLayers',
      noShow: true,
      children: [
        {
          label: 'mapa',
          layer: osm,
          children: [
            { label: 'B&W', name: 'mapa' },
          ]
        },
      ]
    };

    var ctl = L.control.layers.tree(baseTree, undefined,
      {
        namedToggle: true,
        // collapseAll: 'Collapse all',
        // expandAll: 'Expand all',
        collapsed: false,
      });

    this.layerControl = ctl.addTo(map).collapseTree().expandSelected();

  }

  initializeMiniMap(map: Map): void {
    const baseMinimap = L.tileLayer(this.baseMapURl, {
      maxZoom: 30,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    })

    new MiniMap(baseMinimap, {
      toggleDisplay: true
    }).addTo(map);
  }

  getBrazilLayer(): void {
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

  getTerritorioLayer(): void {
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
      });
  }

  getInvestimentosLayer(): void {
    this.investimentoService.findAllSlim().subscribe(
      response => {
        this.invest = new L.GeoJSON(response, {
          pointToLayer: FeatureUtils.setCustomMark,
          onEachFeature: FeatureUtils.customBindPopup
        }).addTo(this.layers);
        this.layerControl.addOverlay(this.invest, "Investimentos");

      });
  }
  filtrarCamadasPorInput() {
    const filterInput = document.querySelector('.filtro-pesquisa') as HTMLInputElement;
    filterInput.addEventListener('input', () => {
      const filterValue = filterInput.value.toLowerCase();
      this.invest.eachLayer((layer: any) => {
        if (layer._icon) {
          layer._icon.style.display = 'None';
          if (contem_municipio_tipologia_territorio_categoria_invest(layer, filterValue)) {
            layer._icon.style.display = 'block';
          }
        }
        else if (layer._path) {
          layer._path.style.display = 'None';
          if (contem_municipio_tipologia_territorio_categoria_invest(layer, filterValue)) {
            layer._path.style.display = 'block';
          }
        }
      });

    });

    function contem_municipio_tipologia_territorio_categoria_invest(layer: any, filterValue: string) {
      const estabelecimento = layer.feature.properties.estabelecimento;
      const municipio = layer.feature.properties.municipio
      const territorio = layer.feature.properties.territorio
      const tipoDeInvestimento = layer.feature.properties.tipoDeInvestimento
      const categoriaMapeamento = layer.feature.properties.categoriaMapeamento

      return municipio.toLowerCase().includes(filterValue) || territorio.toLowerCase().includes(filterValue)
        || tipoDeInvestimento.toLowerCase().includes(filterValue) || categoriaMapeamento.toLowerCase().includes(filterValue)
        || estabelecimento.toLowerCase().includes(filterValue);
    }
  };
}
