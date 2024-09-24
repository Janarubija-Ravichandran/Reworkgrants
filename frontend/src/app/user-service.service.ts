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
//update user details
  updateUserDetails(user: any): Observable<any> {
    console.log("User data being sent:", user);  // Debug: Log the data being sent
    return this.http.put(`${this.apiUrl}/modify_user`, user);
  }
}
