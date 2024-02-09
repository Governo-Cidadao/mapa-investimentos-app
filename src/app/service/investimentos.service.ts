import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeoJsonObject } from 'geojson';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root'
})
export class InvestimentosService {
	private baseURL: string = environment.apiBaseURL + "/api/v1/investimentos"

	constructor(private http: HttpClient) { }

	findAll(filter: string): Observable<GeoJsonObject> {
		return this.http.get<GeoJsonObject>(this.baseURL, { params: { 'filter': filter } });
	}

	findAllSlim(): Observable<GeoJsonObject> {
		return this.http.get<GeoJsonObject>(`${this.baseURL}/slim`);
	}
}
