import { Component } from '@angular/core';
import { HtmlUtil } from '../../utils/html.utils';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  faClose = faClose;

  public static showCarousel(id: string): void {
    const carousel = document.getElementById(id);
    const containerCarousel = document.querySelector<HTMLElement>('.outer-carousel-container');
    carousel!.style.display = 'flex';
    HtmlUtil.showElements(false, containerCarousel!);
  }

  public static hideCarousel(id: string): void {
    const carousel = document.getElementById(id);
    const containerCarousel = document.querySelector<HTMLElement>('.outer-carousel-container');
    if (carousel)
      carousel.style.display = 'none';
    HtmlUtil.showElements(true, containerCarousel!);
  }

  public static getCarousel(
    pathPhoto: string,
    area: string,
    numPhotos: number,
    codEstab: string
  ): HTMLElement {
    const fragment = document.createDocumentFragment();
    const div = document.createElement('div');
    div.classList.add('carousel-container', 'fotos');
    div.id = `${area}_${codEstab}_fotos`;
    div.style.display = 'none';
    div.setAttribute('index', '0');

    const [imgsElement, dotSliderElement] = HtmlUtil.populatePhotosAndDots(pathPhoto, area, numPhotos, codEstab);
    const btnBackElement = HtmlUtil.createButtonElement(area, codEstab, false);
    const btnForwardElement = HtmlUtil.createButtonElement(area, codEstab, true, numPhotos);

    if (numPhotos < 1) {
      fragment.appendChild(imgsElement);
      fragment.appendChild(dotSliderElement);
    } else {
      fragment.appendChild(btnBackElement);
      fragment.appendChild(imgsElement);
      fragment.appendChild(btnForwardElement);
      fragment.appendChild(dotSliderElement);
    }

    const closeButton = document.querySelector<HTMLElement>('.close-icon');
    closeButton?.addEventListener('click', () => CarouselComponent.hideCarousel(div.id));

    div.appendChild(fragment);
    return div;
  }

  public static moveBack(backButton: HTMLButtonElement, id: string): void {
    let carousel = document.getElementById(id + '_fotos');
    if (carousel) {
      let index = Number(carousel.getAttribute('index'));
      let forwardButton = document.getElementById(`botao_avancar_${id}`)
      if (index > 0) {
        index -= 1;
        carousel.setAttribute('index', index.toString())
        CarouselComponent.changePicture(id);
        if (forwardButton!.style.visibility == 'hidden')
          forwardButton!.style.visibility = 'visible'
        if (index == 0)
          backButton.style.visibility = 'hidden';
      }
    }
  }

  public static moveForward(id: string, max: number): void {
    let carousel = document.getElementById(id + '_fotos')
    let index = Number(carousel!.getAttribute('index'))
    let backButton = document.getElementById(`botao_voltar_${id}`)

    index += 1;
    carousel!.setAttribute('index', index.toString())
    if (index == max) {
      index = 0;
      carousel!.setAttribute('index', index.toString())
    }

    if (backButton!.style.visibility == 'hidden') {
      backButton!.style.visibility = 'visible'
    }

    CarouselComponent.changePicture(id)
  }

  public static changePicture(id: string): void {
    let carousel = document.getElementById(id + '_fotos');
    let index = Number(carousel!.getAttribute('index'));
    let container = document.getElementById(id + '_fotos');
    let navDot = document.querySelectorAll('[id="' + id + '_ponto"]');
    let imgs = container!.querySelectorAll<HTMLElement>('.img-carousel');

    if (index == imgs.length)
      index = 0;

    for (let i = 0; i < imgs.length; i++) {
      if (i === index) {
        imgs[i].style.display = "block";
        imgs[i].classList.add('transicao')
        navDot[i].classList.add('ativo');
      }
      else {
        imgs[i].style.display = "none";
        navDot[i].classList.remove('ativo');
        imgs[i].classList.remove('transicao')
      }
    }
  }
}
