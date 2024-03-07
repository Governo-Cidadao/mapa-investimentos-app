import { AfterViewInit, Component } from '@angular/core';
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
export class MapComponent implements AfterViewInit {
  INITIAL_COORD = [-5.844865661075205, -36.56710587301696];
  baseMapURl: string = 'http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}';
  layers: L.LayerGroup = new L.LayerGroup();
  layerControl!: L.Control.Layers;
  invest: any;
  investimentos_estrutura: any
  controler: any
  vetorMaker: any = []

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
  ngAfterViewInit(): void {

  }

  onMapReady(map: Map): void {
    this.initializeLayerControl(map);
    this.initializeMiniMap(map);
    this.getBrazilLayer();
    this.getTerritorioLayer();
    this.getInvestimentosLayer();
    this.mapService.setMap(map);

  }

  initializeLayerControl(map: Map): void {
    var osm = L.tileLayer(this.baseMapURl, { maxZoom: 12, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© contributors: @joabesamuell, @_ig0rdias, @celilimaf, @rodmatth, @jonas.ssilva' })

    var baseTree = {
      label: 'BaseLayers',
    };

    this.controler = L.control.layers.tree(baseTree, undefined, {
    });

    this.layerControl = this.controler.addTo(map).collapseTree().expandSelected();

    this.controler.addTo(map).collapseTree().expandSelected();

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
        // this.layerControl.addOverlay(territorio, "Territórios");
      });
  }

  getInvestimentosLayer(): void {
    this.investimentoService.findAllSlim().subscribe(
      response => {
        let investimentos = response;
        let features = (investimentos as any).features;
        let investimentosMapeamento = this.filtarInvestimentos(features)

        // função responsavel por criar a estrutura requirida pela biblioteca layerTree para ser adicionada ao controler
        this.criarEstruturaArvore(investimentosMapeamento)
        this.controler.setOverlayTree(this.investimentos_estrutura)

        controlarEventosFiltragem();
      });


    function controlarEventosFiltragem() {
      const headerController: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.leaflet-layerstree-header.leaflet-layerstree-header-pointer');
      const filhosController: NodeListOf<HTMLElement> | null = document.querySelectorAll<HTMLElement>(".leaflet-layerstree-children");

      if (filhosController)
        filhosController.forEach(elemento => {
          elemento.style.marginLeft = '15px'
        })


      headerController.forEach(elemento => {
        let span = elemento.querySelector('span')
        if (span) {
          span.style.display = 'none'
        }
      })

      headerController.forEach(elemento => {
        const children: HTMLCollection = elemento.parentElement!.children;
        for (let i = 0; i < children.length; i++) {
          const child: HTMLElement = children[i] as HTMLElement;
          if (child !== elemento) {
            child.style.display = 'none';
          }
        }

        elemento.addEventListener('click', () => {
          const children: HTMLCollection = elemento.parentElement!.children;
          for (let i = 0; i < children.length; i++) {
            const child: HTMLElement = children[i] as HTMLElement;
            if (child !== elemento) {
              if (child.style.display === 'none') {
                child.style.display = 'block';
              } else {
                child.style.display = 'none';
              }
            }
          }
        });
      });
    }

    this.filtrarCamadasPorInput();
  }
  filtarInvestimentos(features: any) {
    let investimentosMapeamento: any = [];
    for (let i = 0; i < features.length; i++) {
      let areaIndex = investimentosMapeamento.findIndex((element: any) =>
        element.areaMapeamento === features[i].properties.areaMapeamento
      );
      if (areaIndex === -1) {
        investimentosMapeamento.push({
          areaMapeamento: features[i].properties.areaMapeamento,
          tipologias: [{
            tipologiaMapeamento: features[i].properties.tipologiaMapeamento,
            categorias: [{
              categoriaMapeamento: features[i].properties.categoriaMapeamento,
              elementos: [features[i]]
            }]
          }]
        });
      } else {
        let tipologiaIndex = investimentosMapeamento[areaIndex].tipologias.findIndex((element: any) =>
          element.tipologiaMapeamento === features[i].properties.tipologiaMapeamento
        );

        if (tipologiaIndex === -1) {
          investimentosMapeamento[areaIndex].tipologias.push({
            tipologiaMapeamento: features[i].properties.tipologiaMapeamento,
            categorias: [{
              categoriaMapeamento: features[i].properties.categoriaMapeamento,
              elementos: [features[i]]
            }]
          });
        } else {
          let categoriaIndex = investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias.findIndex((element: any) =>
            element.categoriaMapeamento === features[i].properties.categoriaMapeamento
          );

          if (categoriaIndex === -1) {
            investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias.push({
              categoriaMapeamento: features[i].properties.categoriaMapeamento,
              elementos: [features[i]]
            });
          } else {
            investimentosMapeamento[areaIndex].tipologias[tipologiaIndex].categorias[categoriaIndex].elementos.push(features[i]);
          }
        }
      }
    }
    return investimentosMapeamento
  }


  criarIconPersonalizado(feature: any) {
    const BASE_CAMINHO_IMAGEM = 'assets/icones_novos';
    const nameIcon = FeatureUtils.getIconPath(feature, BASE_CAMINHO_IMAGEM);
    const myIcon = L.icon({
      iconUrl: nameIcon,
      iconSize: [35, 35],
      shadowSize: [35, 20],
      iconAnchor: [12, 12],
      shadowAnchor: [12, 6],
      popupAnchor: [0, 0]
    });
    return myIcon;
  }

  criarEstruturaArvore(investimentosMapeamento: any) {
    this.investimentos_estrutura = {
      label: ' INVESTIMENTOS',
      selectAllCheckbox: 'true',
      children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>
    };

    investimentosMapeamento.forEach((area: any) => {
      let areaNode = {
        label: ' ' + area.areaMapeamento,
        selectAllCheckbox: true,
        children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>

      };

      area.tipologias.forEach((tipologia: any) => {
        let tipologiaNode = {
          label: ' ' + tipologia.tipologiaMapeamento,
          selectAllCheckbox: true,
          children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>

        };
        areaNode.children.push(tipologiaNode);

        tipologia.categorias.forEach((categoria: any) => {
          let categoriaNode = {
            label: ' ' + categoria.categoriaMapeamento,
            selectAllCheckbox: true,
            children: [] as Array<{ label: string; selectAllCheckbox: boolean; children: Array<any> }>

          };

          categoria.elementos.forEach((elemento: any) => {
            let label = ' ' + elemento.properties.categoriaMapeamento
            let marcador = this.construirMarcador(elemento, label)
            tipologiaNode.children.push(marcador);

          })

        })
      })
      this.investimentos_estrutura.children.push(areaNode);
    })


  }
  construirMarcador(elemento:any, label :String){
    let cordenadas = elemento.geometry.coordinates;
    let type = elemento.geometry.type;
    let estruturaElemento: any;
    if (type == "Point") {
            let myIcon = this.criarIconPersonalizado(elemento);
            let marker = L.marker([cordenadas[1], cordenadas[0]], { icon: myIcon });
            FeatureUtils.customBindPopup(elemento, marker);
            const objetoMarcadorFeature = {
              marcador: marker,
              feature: elemento
            };
            this.vetorMaker.push(objetoMarcadorFeature);
            estruturaElemento = { label: label, layer: marker };
          }
      return estruturaElemento
  }

  filtrarCamadasPorInput() {
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
