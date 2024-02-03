import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CoviddataService {

  private apiUrl = 'https://data.covid19india.org/data.json';

  constructor(private http: HttpClient) {}

  getCovidData(){
    return this.http.get(this.apiUrl) .pipe(map(data => {
      return data;
    }))

  }
  
}
