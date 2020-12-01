import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { analyzeAndValidateNgModules } from '@angular/compiler';
 

@Injectable({
  providedIn: 'root'
})
export class SensorService {

    constructor(private httpClient: HttpClient) {}

    getPurpleAirSensors() {
      // const url = 'https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair';
      // esriRequest(url, {
      //   responseType: 'json'
      // }).then(function(response: any) {
      //   console.log("ESRI: ", response);
      //   // In this case, we simply print out the response to the page.
      //   var responseJSON = JSON.stringify(response, null, 2);
      // });

        const requestOptions: Object = {
            headers: new HttpHeaders().append('x-api-key', `B8WaUqiDKn3NGpuN5rWFvKtIPsK1dSG8z83Vvfib`),
            responseType: 'json'
          }
        return this.httpClient.get('https://k5emdaxun6.execute-api.us-east-1.amazonaws.com/dev/purpleair', requestOptions);
    }

    createAuthorizationHeader(headers: Headers) {
        headers.append('Content-Type', 'application/json');
        headers.append('x-api-key', `B8WaUqiDKn3NGpuN5rWFvKtIPsK1dSG8z83Vvfib`);
    }
}