import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [MessageService]
})
export class RegisterComponent {
  username = '';
  password = '';
  email = '';

  usernameError = '';
  passwordError = '';
  emailError = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  clearError() {
    this.usernameError = '';
    this.passwordError = '';
    this.emailError = '';
  }

  validateForm(): boolean {
    let isValid = true;

    if (this.username.trim() === '') {
      this.usernameError = 'Username is required';
      isValid = false;
    } else if (this.username.length < 3) {
      this.usernameError = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (this.email.trim() === '') {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.validateEmail(this.email)) {
      this.emailError = 'Invalid email format';
      isValid = false;
    }

    if (this.password.trim() === '') {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (!this.validatePassword(this.password)) {
      this.passwordError = 'Password must contain at least one special character, one uppercase letter, one lowercase letter, one number, and be 6-20 characters long';
      isValid = false;
    }

    return isValid;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  }

  validatePassword(password: string): boolean {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/;
    return passwordRegex.test(password);
  }

  registerSuccess() {
    this.messageService.add({
      severity: 'success',
      summary: 'Registration Successful',
      detail: 'You have been registered successfully.',
      key: 'tl'
    });
  }

  registerError(errorMessage: string) {
    this.messageService.add({
      severity: 'error',
      summary: 'Registration Failed',
      detail: errorMessage,
      key: 't2'
    });
  }

  register() {
    if (this.validateForm()) {
      const url = `${this.apiUrl}/register`;
      this.http.post<{ message: string }>(url, {
        username: this.username,
        password: this.password,
        email: this.email
      })
        .subscribe({
          next: (response) => {
            this.registerSuccess();
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 500);
          },
          error: (error) => {
            this.registerError('An error occurred during registration. Please try again.');
            setTimeout(() => {
            }, 1000);
          }
        });
    } else {
      this.registerError('Please correct the errors in the form.');
      setTimeout(() => {
      }, 1000);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
