import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Layer } from '../models/layer.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LayerService {

    constructor(private httpClient: HttpClient) {}

    httpOptions = {
      headers: new HttpHeaders({
        'X-API-KEY': environment.apiKey
      })
    }

    getLayers(): Observable<Layer[]> {
        return this.httpClient.get<Layer[]>(`${environment.serverHost}/api/layers`, this.httpOptions);
    }

    uploadGeoJSONLayer(data: Layer) {
        return this.httpClient.post<any>(`${environment.serverHost}/api/MapLayer/GeoJSON`, data, this.httpOptions);
    }

    uploadAGOLLayer(data: Layer) {
        return this.httpClient.post<any>(`${environment.serverHost}/api/layers/arcgis`, data, this.httpOptions);
    }

    updateLayer(data: Layer) {
        return this.httpClient.put<any>(`${environment.serverHost}/api/MapLayer/GeoJSON`, data, this.httpOptions);
    }

    deleteLayer(id: number) {
        return this.httpClient.delete<any>(`${environment.serverHost}/api/layers/${id}`, this.httpOptions);
    }
}
