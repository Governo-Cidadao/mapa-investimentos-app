import { Component } from '@angular/core';
import L, { Map, latLng, tileLayer } from 'leaflet';
import { MiniMap } from 'leaflet-control-mini-map';
import 'leaflet.control.layers.tree';
import { EstadoService } from '../../service/estado.service';
import { InvestimentosService } from '../../service/investimentos.service';
import { MapService } from '../../service/map.service';
import { TerritorioService } from '../../service/territorio.service';
import { HtmlUtil } from '../../utils/html.utils';
import { TreeUtil } from '../../utils/tree.utils';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent {
  INITIAL_COORD = [-5.844865661075205, -36.56710587301696];
  baseMapURl: string = 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}';
  layers: L.LayerGroup = new L.LayerGroup();
  invest: any;
  layerController: any;
  vetorMaker: any = [];

  structureInvest = {
    label: 'Investimentos',
    selectAllCheckbox: 'true',
    children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>
  };

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

  }

  initializeLayerControl(map: Map): void {
    this.layerController = L.control.layers.tree();
    this.layerController.addTo(map);
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
        new L.GeoJSON(response, { style: whiteBackground })
          .addTo(this.layers);
      });
  }

  getInvestimentosLayer(): void {
    this.investimentoService.findAllSlim().subscribe(
      response => {
        let investimentos = response;
        let features = (investimentos as any).features;
        let investimentosMapeamento = TreeUtil.filterAreaTipoCate(features);

        // função responsavel por criar a estrutura requirida pela biblioteca layerTree para ser adicionada ao controler
        TreeUtil.populateTree(investimentosMapeamento, this.structureInvest, this.vetorMaker);
        this.layerController.setOverlayTree(this.structureInvest);

        HtmlUtil.marginAndHideTreeHeader();
      });

    this.filterLayersByInput();
  }

  filterLayersByInput() {
    const filterInput = document.querySelector('.filtro-pesquisa') as HTMLInputElement;
    filterInput.addEventListener('input', () => {
      const filterValue = filterInput.value.toLowerCase();
      for (let i = 0; i < this.vetorMaker.length; i++) {
        if (this.vetorMaker[i]['marcador']) {
          this.vetorMaker[i]['marcador'].dragging._marker._icon.style.display = 'none';
          if (contemMunicipioTipologiaTerritorioCategoriaInvest(this.vetorMaker[i]['feature'], filterValue)) {
            this.vetorMaker[i]['marcador'].dragging._marker._icon.style.display = 'block';
          }
        } else if (this.vetorMaker[i]._path) {
          this.vetorMaker[i].dragging._marker._icon.display = 'none';
          if (contemMunicipioTipologiaTerritorioCategoriaInvest(this.vetorMaker[i]['feature'], filterValue)) {
            this.vetorMaker[i].dragging._marker._icon.display = 'block';
          }
        }
      }
    });

    function contemMunicipioTipologiaTerritorioCategoriaInvest(layer: any, filterValue: string) {
      const estabelecimento = layer.properties.estabelecimento;
      const municipio = layer.properties.municipio;
      const territorio = layer.properties.territorio;
      const tipoDeInvestimento = layer.properties.tipoDeInvestimento;
      const categoriaMapeamento = layer.properties.categoriaMapeamento;

      return municipio.toLowerCase().includes(filterValue) || territorio.toLowerCase().includes(filterValue)
        || tipoDeInvestimento.toLowerCase().includes(filterValue) || categoriaMapeamento.toLowerCase().includes(filterValue)
        || estabelecimento.toLowerCase().includes(filterValue);
    }
  }
}
