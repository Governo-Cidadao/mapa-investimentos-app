import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {

  public static closeModal() {
    const modal = document.querySelector<HTMLElement>('.container-modal')
    modal!.style.display = 'none';

    const carousels = document.querySelectorAll<HTMLElement>('.fotos')
    carousels.forEach(function (carousel) { carousel.style.display = 'none' })

    const infos = document.querySelectorAll<HTMLElement>('.informacao')
    infos.forEach(function (informacao) { informacao.style.display = 'none' })

    ModalComponent.showElements(true)
  }

  public static showModal(codEstab: string, showInfos: boolean = false, numPhotos: number = 0) {
    const modal = document.querySelector<HTMLElement>('.container-modal');
    const closePhotos = document.querySelector<HTMLElement>('.close-icon');
    const info = document.querySelector<HTMLElement>('.close-icon-info');
    const idPhoto = codEstab.replace(/_fotos$/, '');

    if (showInfos) {
      closePhotos!.style.display = 'none';
      info!.style.display = 'block';
    }
    else {
      closePhotos!.style.display = 'block';
      info!.style.display = 'block';
      // iniciarCarrosselAutomatico(idPhoto, numPhotos)
    }

    ModalComponent.showElements(false);

    modal!.style.display = 'flex';
    CarouselComponent.showCarousel(codEstab);
  }

  public static showElements(option: boolean) {
    const filtro = document.querySelector<HTMLElement>('.containerFiltro')
    const layers = document.querySelector<HTMLElement>('.container_buton_personalizado')
    const controller = document.querySelector<HTMLElement>('.container-controller')
    const minimap = document.querySelector<HTMLElement>('.leaflet-control-minimap')

    filtro!.style.display = 'none';
    layers!.style.display = 'none';
    controller!.style.display = 'none';
    minimap!.style.display = 'none';

    if (option) {
      filtro!.style.display = 'flex';
      layers!.style.display = 'flex';
      controller!.style.display = 'flex';
      minimap!.style.display = 'block';
    }

  }

}
