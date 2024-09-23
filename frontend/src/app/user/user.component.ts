import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from './../user-service.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user = {
    email: '',
    name: '',
    organization_name: '',
    address: '',
    city: '',
    state: ''
  };
  userExists = false;
  message: string | null = null;

  constructor(private userService: UserService, private messageService: MessageService) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.user.email = storedEmail;
      this.getUserDetails(storedEmail);
    }
  }
  getUserDetails(storedEmail: string): void {
    if (storedEmail) {
      return;
    }

    this.userService.getUserDetails(storedEmail).subscribe(
      (response) => {
        if (response.users && response.users.length > 0) {
          this.user = response.users[0];
          this.userExists = true;
        } else {
          this.userExists = false;
        }
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );
  }

  onSubmit(form: NgForm): void {
    if (this.userExists) {
      this.userService.updateUserDetails(this.user).subscribe(
        () => {
          this.message = 'User details updated successfully!';
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User details updated successfully!' });
        },
        (error) => {
          console.error('Error updating user details:', error);
          this.message = 'Error updating user details.';
        }
      );
    } else {
      this.userService.addUserDetails(this.user).subscribe(
        () => {
          this.message = 'User details added successfully!';
          this.userExists = true;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User details added successfully!' });
        },
        (error) => {
          console.error('Error adding user details:', error);
          this.message = 'Error adding user details.';
        }
      );
    }
  }
}
