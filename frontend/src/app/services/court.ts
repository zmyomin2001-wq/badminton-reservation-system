import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Court {
  _id?: string;
  name: string;
  pricePerHour: number;
  status: 'active' | 'maintenance';
}

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  private apiUrl = 'http://localhost:3000/api/courts';

  constructor(private http: HttpClient) {}

  // Read
  getCourts(): Observable<Court[]> {
    return this.http.get<Court[]>(this.apiUrl);
  }

  // Create
  createCourt(court: Court): Observable<Court> {
    return this.http.post<Court>(this.apiUrl, court);
  }

  // Update
  updateCourt(id: string, court: Court): Observable<Court> {
    return this.http.put<Court>(
      `${this.apiUrl}/${id}`,
      court
    );
  }

  // Delete
  deleteCourt(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }
}