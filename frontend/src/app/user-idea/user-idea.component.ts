import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// Define the interface outside the class
export interface Idea {
  id?: string;  // Assuming that the idea has an ID when fetched from the server
  project_summary: string;
  budget_details: string;
  timeline: string;
}

@Component({
  selector: 'app-user-idea',
  templateUrl: './user-idea.component.html',
  styleUrls: ['./user-idea.component.css']
})

export class UserIdeaComponent implements OnInit {
  ideaForm!: FormGroup;
  editMode = false;
  selectedIdeaId: string = '';
  ideas: Idea[] = [];  // Properly type the ideas array
  userEmail = 'user@gmail.com'; // Replace with the actual user email (from auth/localStorage)

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    // Initialize the form with validation
    this.ideaForm = this.fb.group({
      project_summary: ['', Validators.required],
      budget_details: ['', Validators.required],
      timeline: ['', Validators.required]
    });

    // Fetch the existing ideas for the user on initialization
    this.getIdeas();
  }

  // Submit form: add or modify idea based on mode
  onSubmit(): void {
    const ideaData = this.ideaForm.value;

    if (this.editMode) {
      // Update the existing idea
      const updatedIdea = { ...ideaData, id: this.selectedIdeaId };  // Include the ID for updating
      this.http.put('http://localhost:5000/modify_idea', updatedIdea).subscribe(
        (response: any) => {
          alert(response.message);
          this.resetForm();
          this.getIdeas();
        },
        error => console.error('Error updating idea', error)
      );
    } else {
      // Add a new idea
      const newIdea = { ...ideaData, email: this.userEmail };  // Include the user email when adding a new idea
      this.http.post('http://localhost:5000/add_idea', newIdea).subscribe(
        (response: any) => {
          alert(response.message);
          this.resetForm();
          this.getIdeas();
        },
        error => console.error('Error adding idea', error)
      );
    }
  }

  // Fetch ideas from the backend for the current user
  getIdeas(): void {
    this.http.get<{ ideas: Idea[] }>(`http://localhost:5000/get_ideas?email=${this.userEmail}`).subscribe(
      (response) => {
        this.ideas = response.ideas || [];  // Assign the fetched ideas to the array
      },
      error => console.error('Error fetching ideas', error)
    );
  }

  // Set form for editing mode
  editIdea(idea: Idea): void {
    this.editMode = true;
    this.selectedIdeaId = idea.id || '';  // Set the ID of the idea being edited
    this.ideaForm.patchValue({
      project_summary: idea.project_summary,
      budget_details: idea.budget_details,
      timeline: idea.timeline
    });
  }

  // Reset the form after submission or cancel
  resetForm(): void {
    this.ideaForm.reset();
    this.editMode = false;
    this.selectedIdeaId = '';
  }
}
