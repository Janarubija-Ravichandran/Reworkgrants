import { Component } from '@angular/core';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {
  firstName: string | null = '';
  lastName: string | null = '';
  email: string | null = '';
  organization: string = '';
  addressLine1: string = '';
  addressLine2: string = '';
  town: string = '';
  city: string = '';
  pin: string = '';

  constructor() {}

  ngOnInit() {
    // Retrieve values from localStorage
    this.firstName = localStorage.getItem('firstName') || '';
    this.lastName = localStorage.getItem('lastName') || '';
    this.email = localStorage.getItem('email') || '';
  }

  onSubmit() {
    // Handle form submission logic here
    console.log('Form submitted!');
    console.log({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      organization: this.organization,
      address: {
        addressLine1: this.addressLine1,
        addressLine2: this.addressLine2,
        town: this.town,
        city: this.city,
        pin: this.pin
      }
    });
  }
}
