import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { GeoJsonObject } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {
  private baseURL: string = environment.apiBaseURL + "/api/v1/estados"

  constructor(private http: HttpClient) { }

  public findAll(): Observable<GeoJsonObject> {
    return this.http.get<GeoJsonObject>(this.baseURL);
  }
}
