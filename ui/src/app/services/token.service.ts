import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '../models/token.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient) { }

  getToken(): Observable<Token> {
    return this.httpClient.get<Token>("http://localhost:5431/api/arcgis-token");
  }
}
