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
        return this.httpClient.get<Layer[]>('http://localhost:5431/api/MapLayer/GeoJSON');
    }

    uploadLayer(data: Layer) {
        return this.httpClient.post<any>('http://localhost:5431/api/MapLayer/GeoJSON', data);
    }

    updateLayer(data: any) {
        // update layer
    }

    deleteLayer(id: number) {
        // delete layer
    }
}