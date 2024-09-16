import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
 // isSidenavOpen: boolean = false;


  // toggleSidenav() {
  //   this.isSidenavOpen = !this.isSidenavOpen;
  // }

  // logout() {
  //   // Your logout logic here
  // }
  // isExpanded = true; // Start with sidebar expanded

  // // Example menu items
  // menuItems = [
  //   { label: 'Dashboard', icon: 'pi pi-home' },
  //   { label: 'Settings', icon: 'pi pi-cog' },
  //   { label: 'Profile', icon: 'pi pi-user' },
  //   { label: 'Messages', icon: 'pi pi-envelope' }
  // ];

  // toggleSidebar() {
  //   this.isExpanded = !this.isExpanded;
  // }
  isExpanded = true; // Start with sidebar expanded

  // Example menu items with router links
  menuItems = [
    { label: 'Dashboard', icon: 'pi pi-home' },
    { label: 'Settings', icon: 'pi pi-cog' },
    { label: 'Profile', icon: 'pi pi-user'},
    { label: 'Messages', icon: 'pi pi-envelope' }
  ];

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }
}
