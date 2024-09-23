import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:5000'; // Backend URL

  constructor(private http: HttpClient) {}

  // Get user details by email
  getUserDetails(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get_user?email=${email}`);
  }

  // Add user details
  addUserDetails(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add_user`, user);
  }

  // Update user details
  updateUserDetails(user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modify_user`, user);
  }
}
