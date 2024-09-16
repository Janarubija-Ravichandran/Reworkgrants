import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
  providers: [MessageService]

})
export class MainComponent {
  isSidenavOpen: boolean = false;
  items: any[] = [];
  email: string | null = '';
  token: string | null = '';
  activeRoute: string = '';

  constructor(
    public router: Router,
    private messageService: MessageService

  ) {

  }

  ngOnInit() {
       // Get email and token from localStorage
       this.email = localStorage.getItem('email');
       this.token = localStorage.getItem('token');

       // If email or token is missing, redirect to login page
       if (!this.email || !this.token) {
         this.router.navigate(['/login']);
       }
    this.items = [
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => {
          this.logout();
        }
      }
    ];
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.activeRoute = this.router.url;
    });
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']).then(() => {
      window.location.reload();  // This ensures the main component is removed
    });
    this.messageService.add({ severity: 'success', summary: 'Logged out', detail: 'You have been logged out.' });
  }

  toggleSidenav() {
    this.isSidenavOpen = !this.isSidenavOpen;
  }


  isExpanded = true; // Start with sidebar expanded

  // Example menu items

  menuItems = [
      { label: 'User Detail', icon: 'pi pi-user', router: '/user-detail' },
      { label: 'User Idea', icon: 'pi pi-lightbulb', router: '/user-idea' },
      { label: 'Grants', icon: 'pi pi-file-edit', router: '/grants' },

    // { label: 'Messages', icon: 'pi pi-envelope', router: '/header' }
  ];
  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
  navigateTo(route: string) {
    this.router.navigate([route]);
  }


}
