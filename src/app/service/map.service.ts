import { Injectable } from '@angular/core';
import { Map } from 'leaflet';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private mapSubject = new BehaviorSubject<Map | null>(null);
  map$: Observable<Map | null> = this.mapSubject.asObservable();

  setMap(map: Map): void {
    this.mapSubject.next(map);
  }
}
