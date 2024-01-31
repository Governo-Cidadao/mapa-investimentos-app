import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { GeoJsonObject } from 'geojson';

@Injectable({
  providedIn: 'root'
})
export class TerritorioService {
  private baseURL: string = environment.apiBaseURL + "/api/v1/municipios"

  constructor(private http: HttpClient) { }

  public findAll(): Observable<GeoJsonObject> {
    return this.http.get<GeoJsonObject>(this.baseURL);
  }
}
