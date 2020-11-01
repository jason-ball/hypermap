import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Layer } from '../models/layer.model';

export interface Book {
  name;
  price;
  author;
}

@Injectable({
  providedIn: 'root'
})
export class LayerService {

    constructor(private http: HttpClient) {}

    getLayers(): Layer[] {
        return [
            {
                name: "HOLC Redlining",
                fileType: "GeoJSON",
                size: 100,
                layerData: null
            }
        ];
    }

    uploadLayer(data: any) {
        // post new layer
    }

    updateLayer(data: any) {
        // update layer
    }

    deleteLayer(id: number) {
        // delete layer
    }
}