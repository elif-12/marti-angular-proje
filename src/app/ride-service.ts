import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ride } from './ride';  // ride.ts içindeki model sınıfı

@Injectable({
  providedIn: 'root'
})
export class RideService {

 private apiUrl = 'http://localhost/marti-api/src/api/ride_api.php';

  constructor(private http: HttpClient) { }

  getRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(`${this.apiUrl}?islem=listele`);
  }

  addRide(ride: Ride): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}?islem=ekle`, ride);
  }

  deleteRide(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}?islem=sil&id=${id}`);
  }

  updateRide(ride: Ride): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}?islem=guncelle`, ride);
  }
}
