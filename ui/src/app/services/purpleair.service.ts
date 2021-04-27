import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PurpleAirChartData } from '../models/PurpleAirChartData.model';

@Injectable({
  providedIn: 'root'
})
export class PurpleAirService {

  constructor(private httpClient: HttpClient) { }

  getChartDataForPoint(id: number): Observable<PurpleAirChartData> {
    return this.httpClient.get<PurpleAirChartData>(`${environment.serverHost}/api/purpleair/history/chart/${id}`)
  }
}
