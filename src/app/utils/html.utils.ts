import { CarouselComponent } from "../components/carousel/carousel.component";

export class HtmlUtil {

  public static createElementWithContent(tag: string, content?: string, value?: string): HTMLElement {
    const element = document.createElement(tag);
    if (content)
      element.innerHTML = content;
    if (value) {
      const valueElement = document.createElement('p');
      valueElement.innerHTML = value;
      element.appendChild(valueElement);
    }
    return element;
  }

  public static moveElement(from: string | HTMLElement, to: string | HTMLElement): void {
    const source = (typeof from === 'string') ? document.querySelector<HTMLElement>(`.${from}`) : from;
    const destination = (typeof to === 'string') ? document.querySelector<HTMLElement>(`.${to}`) : to;

    if (!source)
      throw new Error("Source element not found: " + source);

    if (!destination)
      throw new Error("Destination element not found: " + destination);

    destination.appendChild(source);
  }

  public static showElements(option: boolean, elementTarget: HTMLElement) {
    const filtro = document.querySelector<HTMLElement>('.container-input');
    const layers = document.querySelector<HTMLElement>('.container_buton_personalizado');
    const controller = document.querySelector<HTMLElement>('.container-controller');
    const minimap = document.querySelector<HTMLElement>('.leaflet-control-minimap');

    filtro!.style.display = 'none';
    layers!.style.display = 'none';
    controller!.style.display = 'none';
    minimap!.style.display = 'none';
    elementTarget.style.display = 'flex';

    if (option) {
      filtro!.style.display = 'flex';
      layers!.style.display = 'flex';
      controller!.style.display = 'flex';
      minimap!.style.display = 'block';
      elementTarget.style.display = 'none';
    }
  }

  public static populatePhotosAndDots(
    pathPhoto: string,
    area: string,
    numPhotos: number,
    codEstab: string
  ): [HTMLDivElement, HTMLDivElement] {
    const containerImgs = document.createElement('div');
    const containerDot = document.createElement('div');
    containerDot.classList.add('container-index-img');

    for (let i = 0; i < numPhotos; i++) {
      const imgs = document.createElement('img');
      const dotSlider = document.createElement('div');
      if (i === 0) {
        imgs.classList.add('img-carousel');
        imgs.src = `${pathPhoto}/foto_${i}.jpg`
        dotSlider.classList.add('ponto', 'ativo');
        dotSlider.id = `${area}_${codEstab}_ponto`;
      } else {
        imgs.classList.add("img-carousel");
        imgs.src = `${pathPhoto}/foto_${i}.jpg`;
        imgs.style.display = 'none';
        dotSlider.classList.add('ponto');
        dotSlider.id = `${area}_${codEstab}_ponto`;
      }
      containerImgs.appendChild(imgs);
      containerDot.appendChild(dotSlider);
    }


    return [containerImgs, containerDot];
  }

  public static createDescriptionElement(area: string, codEstab: string, tipoInvestimento: string): HTMLDivElement {
    const description = document.createElement('div');
    description.classList.add('descricao');
    description.id = `${area}_${codEstab}_descricao`;
    description.innerHTML = tipoInvestimento;
    return description;
  }

  public static createButtonElement(
    area: string,
    codEstab: string,
    isMovingForward: boolean,
    numPhotos?: number
  ): HTMLButtonElement {
    const button = document.createElement('button');
    const icon = document.createElement('i');

    if (isMovingForward) {
      button.id = `botao_avancar_${area}_${codEstab}`;
      button.addEventListener('click', () => CarouselComponent.moveForward(`${area}_${codEstab}`, numPhotos!));
      icon.classList.add('fa-solid', 'fa-chevron-right');
    } else {
      button.id = `botao_voltar_${area}_${codEstab}`;
      button.addEventListener('click', () => CarouselComponent.moveBack(button, `${area}_${codEstab}`));
      button.style.visibility = 'hidden';
      icon.classList.add('fa-solid', 'fa-chevron-left');
    }

    button.appendChild(icon);
    return button;
  }


  public static marginAndHideTreeHeader(): void {
    const headerController: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('.leaflet-layerstree-header.leaflet-layerstree-header-pointer');
    const childrensController: NodeListOf<HTMLElement> | null = document.querySelectorAll<HTMLElement>(".leaflet-layerstree-children");

    if (childrensController){
      childrensController.forEach(elemento => {
        elemento.style.marginLeft = '15px'
      })
    }

    headerController.forEach(elemento => {
      let span = elemento.querySelector('span')
      if (span)
        span.style.display = 'none'
    })

    headerController.forEach(element => {
      const children: HTMLCollection = element.parentElement!.children;
      for (let i = 0; i < children.length; i++) {
        const child: HTMLElement = children[i] as HTMLElement;
        if (child !== element) {
          child.style.display = 'none';
        }
      }

      HtmlUtil.addHideElementEvent(element);
    })
  }

  public static addHideElementEvent(element: HTMLElement) {
    element.addEventListener('click', () => {
      const children: HTMLCollection = element.parentElement!.children;
      for (let i = 0; i < children.length; i++) {
        const child: HTMLElement = children[i] as HTMLElement;
        if (child !== element)
          if (child.style.display === 'none')
            child.style.display = 'block';
          else
            child.style.display = 'none';
      }
    })
  }
}