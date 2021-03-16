import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PurpleAirChartData } from '../models/PurpleAirChartData.model';

@Injectable({
  providedIn: 'root'
})
export class PurpleairService {

  constructor(private httpClient: HttpClient) { }

  getChartDataForPoint(id: number): Observable<PurpleAirChartData> {
    return this.httpClient.get<PurpleAirChartData>(`http://localhost:5431/api/purpleair/history/chart/${id}`)
  }
}
