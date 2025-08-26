import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'https://localhost:7099/api';
  private appointment = this.baseUrl + '/appointments';

  constructor(private http: HttpClient) {}

  getAppointments(searchValue?: string, doctorId?: string, visitType?: string, pageNo=1, pageSize:string = "10"): Observable<any> {
    let params = new HttpParams().set('pageNo', pageNo).set('pageSize', pageSize);
    if (searchValue) params = params.set('searchValue', searchValue);
    if (doctorId) params = params.set('doctorId', doctorId);
    if (visitType) params = params.set('visitType', visitType);

    return this.http.get(this.appointment, { params });
  }

  getAppointment(id: number): Observable<any> {
    return this.http.get<any>(`${this.appointment}/${id}`);
  }

  createAppointment(appointment: any): Observable<any> {
    return this.http.post<any>(this.appointment, appointment);
  }

  updateAppointment(appointment: any): Observable<void> {
    return this.http.put<void>(this.appointment, appointment);
  }

  deleteAppointment(id: any): Observable<void> {
    return this.http.delete<void>(`${this.appointment}/${id}`);
  }

  sendPrescriptionMail(id: number): Observable<any> {
    return this.http.get<any>(`${this.appointment}/sendPrescriptionMail/${id}`);
  }
}
