import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrl: './virtual-keyboard.component.css'
})
export class VirtualKeyboardComponent implements AfterViewInit {
  inputValue: string = '';



  ngAfterViewInit(): void {
    this.acessarElemento()
    this.iniciarEventos()
  }

  addToInput(value: string) {
    this.inputValue += value;
  }

  clearInput() {
    this.inputValue = '';
  }

  acessarElemento() {
    const containerKeyboard: HTMLElement | null = document.querySelector<HTMLElement>(".container-input");
    const controller: HTMLElement | null = document.querySelector<HTMLElement>(".leaflet-top.leaflet-right");
    const controllerToggle: HTMLElement | null = document.querySelector<HTMLElement>(".leaflet-control-layers-toggle");
    const controllerLayers: HTMLElement | null = document.querySelector<HTMLElement>(".leaflet-control-layers");
    if (containerKeyboard && controller && controllerToggle && controllerLayers) {
      containerKeyboard.appendChild(controller);
      controller.style.position = "static";
      controllerToggle.style.height = "36px";
      controllerToggle.style.width = "36px";
      controllerLayers.style.border = "none";
      controllerLayers.style.boxShadow = "0 1px 5px rgba(0,0,0,0.4)";
      controllerLayers.style.marginRight = "0";
      console.log(controller);
    }
  }

  iniciarEventos() {
    const elementoTeclado: HTMLElement | null = document.querySelector<HTMLElement>(".keyboard");
    if(elementoTeclado)
    elementoTeclado.style.display = "none";
    document.addEventListener("click", function (event) {
      const elementoPesquisa: HTMLElement | null = document.querySelector<HTMLElement>(".filtro-pesquisa");
      if (elementoTeclado && event.target instanceof Node && elementoPesquisa) {
        var clicouFora = !elementoTeclado.contains(event.target);
        var clicouInput = elementoPesquisa.contains(event.target);
        if (clicouFora) {
          elementoTeclado.style.display = "none";
        }
        if (clicouInput) {
          elementoTeclado.style.display = "flex";
        }
      }
    });
  }



}
