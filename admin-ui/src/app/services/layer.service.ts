import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Layer } from '../models/layer.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayerService {

    constructor(private httpClient: HttpClient) {}

    getLayers(): Observable<Layer[]> {
        return this.httpClient.get<Layer[]>('http://localhost:5431/api/layers');
    }

    uploadGeoJSONLayer(data: Layer) {
        return this.httpClient.post<any>('http://localhost:5431/api/MapLayer/GeoJSON', data);
    }

    uploadAGOLLayer(data: Layer) {
        return this.httpClient.post<any>('http://localhost:5431/api/layers/arcgis', data);
    }

    updateLayer(data: Layer) {
        return this.httpClient.put<any>('http://localhost:5431/api/MapLayer/GeoJSON', data);
    }

    deleteLayer(id: number) {
        return this.httpClient.delete<any>(`http://localhost:5431/api/MapLayer/GeoJSON/${id}`);
    }
}
