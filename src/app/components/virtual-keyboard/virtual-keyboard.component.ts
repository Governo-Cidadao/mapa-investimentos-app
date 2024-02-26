import { AfterViewInit, Component } from '@angular/core';
import { faBackspace } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-virtual-keyboard',
  templateUrl: './virtual-keyboard.component.html',
  styleUrls: ['./virtual-keyboard.component.css']
})
export class VirtualKeyboardComponent implements AfterViewInit {
  inputValue: string = '';
  faBackspace = faBackspace;
  private timer: any;

  ngAfterViewInit(): void {
    this.inicializarEventosTeclado()
  }

  addToInput(value: string) {
    this.inputValue += value;
    this.triggerInputChange()
  }

  clearInput() {
    this.inputValue = '';
    this.triggerInputChange()

  }
  backspace() {
    this.inputValue = this.inputValue.slice(0, -1);
    this.triggerInputChange()
  }
  spacer() {
    this.inputValue = this.inputValue + " ";
    this.triggerInputChange()

  }


  inicializarEventosTeclado() {
    const elementoTeclado: HTMLElement | null = document.querySelector<HTMLElement>(".keyboard");
    if (elementoTeclado)
      elementoTeclado.style.display = "none";
    document.addEventListener("click", function (event) {
      const elementoPesquisa: HTMLElement | null = document.querySelector<HTMLElement>(".filtro-pesquisa");
      if (elementoTeclado && event.target instanceof Node && elementoPesquisa) {
        let clicouFora = !elementoTeclado.contains(event.target);
        let clicouInput = elementoPesquisa.contains(event.target);
        if (clicouFora) {
          elementoTeclado.style.display = "none";
        }
        if (clicouInput) {
          elementoTeclado.style.display = "flex";
        }
      }
    });

    // botoesPersonalizadoA
  }

  mostrarOpcoes(letter: string) {
    const botoesPersonalizadoA: HTMLElement | null = document.querySelector<HTMLElement>(".botoesPersonalizadoA");
    if (botoesPersonalizadoA) {
      botoesPersonalizadoA.style.display = "flex";
    }


  }
  startTimer(letter: string) {
    this.timer = setTimeout(() => {
      this.mostrarOpcoes(letter);
    }, 500);
  }
  clearTimer() {
    clearTimeout(this.timer);
  }

  triggerInputChange() {
    const inputElement: HTMLInputElement | null = document.querySelector('.filtro-pesquisa');
    if (inputElement) {
      inputElement.value = this.inputValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}

