import { Component } from '@angular/core';
import { Feature } from 'geojson';
import { FormatNumber } from '../../utils/format.number.utils';
import { CarouselComponent } from '../carousel/carousel.component';
import { HtmlUtil } from '../../utils/html.utils';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  public static closeModal() {
    const modalInfo = document.querySelector<HTMLElement>('.informacao');

    if(modalInfo)
      modalInfo.remove();

    ModalComponent.showElements(true);
  }

  public static showModal(id: string, showInfos: boolean = false, numPhotos: number = 0) {
    const info = document.querySelector<HTMLElement>('.close-icon-info');
    info!.style.display = 'block';

    ModalComponent.showElements(false);
    CarouselComponent.showCarousel(id);
  }

  public static showElements(option: boolean) {
    const filtro = document.querySelector<HTMLElement>('.container-input');
    const layers = document.querySelector<HTMLElement>('.container_buton_personalizado');
    const controller = document.querySelector<HTMLElement>('.container-controller');
    const minimap = document.querySelector<HTMLElement>('.leaflet-control-minimap');
    const modal = document.querySelector<HTMLElement>('.container-modal');

    filtro!.style.display = 'none';
    layers!.style.display = 'none';
    controller!.style.display = 'none';
    minimap!.style.display = 'none';
    modal!.style.display = 'flex';

    if (option) {
      filtro!.style.display = 'flex';
      layers!.style.display = 'flex';
      controller!.style.display = 'flex';
      minimap!.style.display = 'block';
      modal!.style.display = 'none';
    }

  }

  public static modalInfo(feature: Feature, areaMapeamento: string, codEstab: number): HTMLElement {
    if (!feature.properties)
      throw new Error("Propriedades da camada nulas");

    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.classList.add('informacao');
    div.id = `${areaMapeamento}_${codEstab}_informacao`;
    div.style.display = 'none';

    const properties = feature.properties;

    fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Estabelecimento </strong>', properties['estabelecimento']));
    fragment.appendChild(HtmlUtil.createElementWithContent('br'));

    fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Orgão </strong>', properties['orgao']));
    fragment.appendChild(HtmlUtil.createElementWithContent('br'));

    fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Município </strong>', properties['municipio']));
    fragment.appendChild(HtmlUtil.createElementWithContent('br'));

    fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Território </strong>', properties['territorio']));
    fragment.appendChild(HtmlUtil.createElementWithContent('br'));

    fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Área </strong>', properties["areaMapeamento"]));
    fragment.appendChild(HtmlUtil.createElementWithContent('br'));

    if (properties["somatorioBens"] != 0) {
      fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Total Investimento bens </strong>', `R$ ${FormatNumber.formatIntegerNumber(properties["somatorioBens"])}`));
      fragment.appendChild(HtmlUtil.createElementWithContent('br'));
    }
    if (properties["somatorioObras"] != 0) {
      fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Total Investimento obras </strong>', `R$ ${FormatNumber.formatIntegerNumber(properties["somatorioObras"])}`));
      fragment.appendChild(HtmlUtil.createElementWithContent('br'));
    }
    if (properties["somatorioSubprojetos"] != 0) {
      fragment.appendChild(HtmlUtil.createElementWithContent('p', '<strong> Total Investimento subprojetos </strong>', `R$ ${FormatNumber.formatIntegerNumber(properties["somatorioSubprojetos"])}`));
    }

    const closeIcon = document.createElement('div');
    closeIcon.classList.add('close-icon-info');
    closeIcon.textContent = 'x';
    closeIcon.addEventListener('click', () => ModalComponent.closeModal());

    fragment.appendChild(closeIcon);
    div.appendChild(fragment);

    return div;
  }
}
