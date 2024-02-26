import { Component } from '@angular/core';
import { Feature } from 'geojson';
import { FormatNumber } from '../../utils/format.number.utils';
import { HtmlUtil } from '../../utils/html.utils';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  public static showModal(id: string) {
    const info = document.getElementById(id);
    const modal = document.querySelector<HTMLElement>('.container-modal');
    info!.style.display = 'flex';
    HtmlUtil.showElements(false, modal!);
  }

  public static closeModal(id: string) {
    const info = document.getElementById(id);
    const modal = document.querySelector<HTMLElement>('.container-modal');
    info!.style.display = 'none';
    HtmlUtil.showElements(true, modal!);
  }

  public static modalInfo(feature: Feature): HTMLElement {
    if (!feature.properties)
      throw new Error("Propriedade de camada nula");

    const properties = feature.properties;
    const areaMapeamento = properties['areaMapeamento'];
    const codEstab = properties['codigoEstabelecimento'];

    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.classList.add('informacao');
    div.id = `${areaMapeamento}_${codEstab}_informacao`;
    div.style.display = 'none';


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
    closeIcon.addEventListener('click', () => ModalComponent.closeModal(div.id));

    fragment.appendChild(closeIcon);
    div.appendChild(fragment);

    return div;
  }
}
