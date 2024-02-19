import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-controll-layer-custon',
  templateUrl: './controll-layer-custon.component.html',
  styleUrl: './controll-layer-custon.component.css'
})
export class ControllLayerCustonComponent implements AfterViewInit {


  ngAfterViewInit(): void {
    this.criarControllPesonalizado()
  }

  criarControllPesonalizado() {
    const divControl: HTMLElement | null = document.createElement('div');
    const imageButton: HTMLElement | null = document.createElement('a');
    const containerFiltro: HTMLElement | null = document.querySelector<HTMLElement>('.container-input');
    const layerPadrao: HTMLElement | null = document.querySelector<HTMLElement>('.leaflet-control-layers');
    const sectionLayer: HTMLElement | null = document.querySelector<HTMLElement>('.leaflet-control-layers-list');
    const containerLabel: HTMLElement | null = document.querySelector<HTMLElement>(".leaflet-control-layers-overlays");
    const controlePersonalizado = document.createElement('div');


    if (divControl && imageButton && containerFiltro && layerPadrao && sectionLayer && controlePersonalizado && containerLabel && layerPadrao) {
      // console.log("tenho tudo isso")

      containerFiltro.appendChild(divControl)
      divControl.appendChild(imageButton)
      divControl.classList.add('container_buton_personalizado')
      imageButton.classList.add('image_buton_personalizado')
      layerPadrao.style.display = 'None';

      // Pesonalizando seção do controll layer
      containerFiltro.appendChild(sectionLayer)
      sectionLayer.parentNode?.insertBefore(controlePersonalizado, sectionLayer);
      controlePersonalizado.appendChild(sectionLayer)
      controlePersonalizado.classList.add('control-layers_personalizado')
      containerFiltro.appendChild(controlePersonalizado)
      containerLabel.style.display = 'flex'
      containerLabel.style.flexDirection = 'column'

      // eventos ao clicar no novo layer controll
      divControl.addEventListener('click', function () {
        divControl.classList.remove('leaflet-control-layers-expanded');
        if (controlePersonalizado.style.display === 'none') {
          controlePersonalizado.style.display = 'block';
        }
        else {
          controlePersonalizado.style.display = 'none';
        }
      });
      document.addEventListener("mouseup", function (event) {
        if (event.target instanceof Node)
          if (!controlePersonalizado.contains(event.target)) {
            controlePersonalizado.style.display = "None"
          }
      });
    }

  }


}