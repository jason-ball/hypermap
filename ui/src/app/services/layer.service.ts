import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { Layer } from '../models/layer.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LayerService {

    constructor(private httpClient: HttpClient) {}


    getLayers(): Observable<Layer[]> {
        return this.httpClient.get<Layer[]>(`${environment.serverOrigin}:${environment.serverPort}/api/layers`);
    }

    getLayerWithPath(path: string) : Observable<Layer> {
        return this.httpClient.get<Layer>(`${environment.serverOrigin}:${environment.serverPort}${path}`);
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', `B8WaUqiDKn3NGpuN5rWFvKtIPsK1dSG8z83Vvfib`);
    }
}
