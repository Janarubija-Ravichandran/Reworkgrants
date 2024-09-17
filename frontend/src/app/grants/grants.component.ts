import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grant',
  templateUrl: './grants.component.html',
  styleUrls: ['./grants.component.css']
})
export class GrantsComponent implements OnInit {
  grantForm!: FormGroup;
  userIdeas: any[] = []; // Populate this with actual user idea options
  languages: any[] = [ // Populate this with language options
    { label: 'English', value: 'en' },
    { label: 'Hindi', value: 'hi' },
    // Add more languages here
  ];

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.grantForm = this.fb.group({
      govScheme: [null, Validators.required],
      userIdea: [null, Validators.required],
      userForm: ['', Validators.required],
      language: [null, Validators.required]
    });
  }

  onFileUpload(event: any): void {
    // Handle file upload
    console.log('File Uploaded:', event.files);
  }

  onUserIdeaChange(event: any): void {
    // Handle user idea change
    console.log('Selected User Idea:', event.value);
  }

  navigateToUserIdea(): void {
    this.router.navigate(['/user-idea']);
  }

  onSubmit(): void {
    if (this.grantForm.valid) {
      console.log('Form Submitted:', this.grantForm.value);
      // Handle form submission logic here
    }
  }
}
