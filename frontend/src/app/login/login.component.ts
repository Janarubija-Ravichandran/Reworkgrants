import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [MessageService]
})
export class LoginComponent {
  email = '';
  password = '';

  public apiUrl = environment.LOGIN_BASEURL;

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) {}
success(){
  this.messageService.add({
    severity: 'success',
       summary: 'Login Successful',
              detail: 'You have been logged in successfully.',
      key: 'tl',
  });
}

logerr(): void {
  this.messageService.add({
    key: 't2',
    severity: 'warn',
       summary: 'Login Failed',
              detail: 'No token received. Login failed.'
  });
}
epasserr(): void {
  this.messageService.add({
    key: 't3',
    severity: 'error',
        summary: 'Login Failed',
            detail: 'Invalid email or password.'

  });
}
  login() {
    const url = `${this.apiUrl}/login`;
    this.http.post(url, { email: this.email, password: this.password })
      .subscribe({
        next: (response: any) => {
          if (response.token) {

            localStorage.setItem('token', response.token);
            localStorage.setItem('email', this.email);
            this.success();

            setTimeout(() => {
              this.router.navigate(['/user-detail']);
            }, 500);
             } else {
            this.logerr();

            setTimeout(() => {
            }, 1000);

          }
        },
        error: (error: any) => {
          this.epasserr();

          setTimeout(() => {
          }, 1000);

        }
      });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}

// import { Component } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { environment } from 'src/environments/environment';
// import { MessageService } from 'primeng/api';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css'],
//   providers: [MessageService]
// })
// export class LoginComponent {
//   email = '';
//   password = '';

//   public apiUrl = environment.LOGIN_BASEURL;

//   constructor(
//     private http: HttpClient,
//     private router: Router,
//     private messageService: MessageService
//   ) {}

//   login() {
//     const url = `${this.apiUrl}/login`;
//     this.http.post(url, { email: this.email, password: this.password })
//       .subscribe({
//         next: (response: any) => {
//           if (response.token) {
//             localStorage.setItem('token', response.token);
//             localStorage.setItem('email', this.email);
//             this.messageService.add({
//               severity: 'success',
//               summary: 'Login Successful',
//               detail: 'You have been logged in successfully.'
//             });
//             this.router.navigate(['/file']);
//           } else {
//             this.messageService.add({
//               severity: 'error',
//               summary: 'Login Failed',
//               detail: 'No token received. Login failed.'
//             });
//           }
//         },
//         error: (error: any) => {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Login Failed',
//             detail: 'Invalid email or password.'
//           });
//         }
//       });
//   }

//   navigateToRegister() {
//     this.messageService.add({
//       severity: 'info',
//       summary: 'Navigation',
//       detail: 'Navigating to registration page.'
//     });
//     this.router.navigate(['/register']);
//   }
// }
