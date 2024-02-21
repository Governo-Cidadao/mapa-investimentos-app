import { Component } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {

  public static showCarousel(id: string) {
    const carousel = document.getElementById(id);
    carousel!.style.display = 'flex';
  }

  public static hideCarousel(id: string) {
    const carousel = document.getElementById(id);
    carousel!.style.display = 'none';
  }
}
