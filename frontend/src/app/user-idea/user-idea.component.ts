import { Component } from '@angular/core';

@Component({
  selector: 'app-user-idea',
  templateUrl: './user-idea.component.html',
  styleUrls: ['./user-idea.component.css']
})
export class UserIdeaComponent {
  projectName: string = '';
  projectSummary: string = '';
  budgetDetails: string = '';
  time: string = '';
  email: string = '';

  ngOnInit(): void {
    // Fetch email from localStorage
    this.email = localStorage.getItem('email') || '';
  }

  onSubmit(): void {
    // Handle form submission
    console.log('Form submitted with the following data:');
    console.log('Project Name:', this.projectName);
    console.log('Project Summary:', this.projectSummary);
    console.log('Budget Details:', this.budgetDetails);
    console.log('Time:', this.time);
    console.log('Email:', this.email);
  }
}
