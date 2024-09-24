import { Component, OnInit } from '@angular/core';
import { UserService } from './../user-service.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // Import Router

export interface User {
  id: number;
  email: string;
  name: string;
  organization_name: string;
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
  user: User | null = null;
  userExists = false;
  message: string | null = null;
  editMode = false;
  userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      this.getUserDetails(storedEmail);
    }
  }

  getUserDetails(email: string): void {
    this.userService.getUserDetails(email).subscribe(
      (response) => {
        if (response.users && response.users.length > 0) {
          const userArray = response.users[0];
          this.user = {
            id: userArray[0],
            email: userArray[1],
            name: userArray[2],
            organization_name: userArray[3],
            address: userArray[4],
            city: userArray[5],
            state: userArray[6],
          };
          this.userExists = true;
          this.initializeForm();
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

  initializeForm(): void {
    this.userForm = this.fb.group({
      email: [{ value: this.user?.email, disabled: true }, Validators.required],
      name: [this.user?.name, Validators.required],
      organization_name: [this.user?.organization_name],
      address: [this.user?.address],
      city: [this.user?.city],
      state: [this.user?.state],
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
  saveUserDetails(): void {
    if (this.userForm.valid) {
      const updatedUser = { ...this.user, ...this.userForm.value }; // Merge user with updated form values

      this.userService.updateUserDetails(updatedUser).subscribe(
        (response) => {
          console.log('Update response:', response); // Log the response
          this.user = response.updatedUser || updatedUser; // Update local user with response data if available
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User details updated successfully!' });
          this.editMode = false;
          this.getUserDetails(this.user?.email || ''); // Refresh user details
        },
        (error) => {
          console.error('Error updating user details:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error updating user details.' });
        }
      );
    } else {
      this.messageService.add({ severity: 'warn', summary: 'Warning', detail: 'Please fill in all required fields.' });
    }
  }
  addDetails(): void {

          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User details added successfully!' });
          this.router.navigate(['/user']); // Navigate to /user
       
  }


}
