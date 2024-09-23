import { Component, OnInit } from '@angular/core';
import { UserService } from './../user-service.service'; // Adjust path as necessary
import { MessageService } from 'primeng/api'; // For toast notifications
export interface User {
  id: number;
  email: string;
  name: string;
  organizationName: string;
  address: string;
  city: string;
  state: string;
}

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  user: User | null = null; // To store user details
  userExists = false;
  message: string | null = null;

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email'); // Get email from localStorage
    if (storedEmail) {
      this.getUserDetails(storedEmail);
    }
  }

  getUserDetails(email: string): void {
    this.userService.getUserDetails(email).subscribe(
      (response) => {
        console.log('Response from server:', response); // Log the entire response
        if (response.users && response.users.length > 0) {
          const userArray = response.users[0]; // Get the first user array
          // Map to User interface
          this.user = {
            id: userArray[0],
            email: userArray[1],
            name: userArray[2],
            organizationName: userArray[3],
            address: userArray[4],
            city: userArray[5],
            state: userArray[6],
          };
          this.userExists = true;
        } else {
          this.userExists = false;
          this.message = 'No user details found.';
          this.messageService.add({ severity: 'warn', summary: 'Warning', detail: this.message });
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
        this.message = 'Error fetching user details.';
        this.messageService.add({ severity: 'error', summary: 'Error', detail: this.message });
      }
    );
  }
}
