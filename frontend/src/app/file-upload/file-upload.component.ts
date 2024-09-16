import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from '../material-module';
import jsPDF from 'jspdf';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
  providers: [MessageService]
})
export class FileUploadComponent implements OnInit {
  @ViewChild('schemeFileInput') schemeFileInput!: ElementRef;
  @ViewChild('ideaFileInput') ideaFileInput!: ElementRef;
  schemeFile: { file: File, uploadedTime: Date } | null = null;
  ideaFile: { file: File, uploadedTime: Date } | null = null;
  urlList: string = '';
  progress: number = 0;
  uploadedFiles: { file: File, uploadedTime: Date }[] = [];
  userId: string = '123456';
  email: string | null = '';
  isSidenavOpen = false;
  isLoading = false;
  displayDialog: boolean = false;
  fileName: string = '';

  brdForm: FormGroup;
  languages = [
    { label: 'English', value: 'English' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'chinese', value: 'chinese' },
    { label: 'French', value: 'French' },
    { label: 'Spanish', value: 'Spanish' },
    {label:'malayalam',value:'malayalam'},

    { label: 'Telugu', value: 'Telugu' },
    { label: 'Gujarati', value: 'Gujarati' },
    { label: 'Kannada', value: 'Kannada' },
    { label: 'Urdu', value: 'Urdu' },
    { label: 'Sanskrit', value: 'Sanskrit' },
    { label: 'Turkish', value: 'Turkish' },
    { label: 'Arabic', value: 'Arabic' },
    { label: 'German', value: 'German' },
    { label: 'Portuguese', value: 'Portuguese' },
    { label: 'Russian', value: 'Russian' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Korean', value: 'Korean' },
    { label: 'Italian', value: 'Italian' },
    { label: 'Bengali', value: 'Bengali' },
    { label: 'Marathi', value: 'Marathi' },
  ];
  brdContent: string = '';
  isEditing = false;
  editableContent: string='';
  downloadUrl: string | null = null;
  public apiUrl = environment.LOGIN_BASEURL;

  constructor(
    public dialog: MatDialog,
    public router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private messageService: MessageService
  ) {
    this.brdForm = this.fb.group({
      summary: ['', Validators.required],
      language: ['English', Validators.required]
    });
  }

  ngOnInit(): void {
    this.email = localStorage.getItem('email');
    if (!this.email) {
      this.router.navigate(['/login']);
    }
    this.editableContent = this.brdContent;
  }
  onSchemeFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.schemeFile = { file, uploadedTime: new Date() };
      this.uploadFile(file);
    }
    this.schemeFileInput.nativeElement.value = '';
  }
  onIdeaFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.ideaFile = { file, uploadedTime: new Date() };
      this.uploadFile(file);
    }
    this.ideaFileInput.nativeElement.value = '';
  }
  removeSchemeFile(): void {
    this.schemeFile = null;
    this.progress = 0;
    this.schemeFileInput.nativeElement.value = '';
  }
  removeIdeaFile(): void {
    this.ideaFile = null;
    this.progress = 0;
    this.ideaFileInput.nativeElement.value = '';
  }
  uploadFile(file: File): void {
    this.progress = 0;
    const interval = setInterval(() => {
      if (this.progress >= 100) {
        clearInterval(interval);
      } else {
        this.progress += 10;
      }
    }, 200);
  }



  processFiles(): void {
    if (this.schemeFile && this.ideaFile) {
      this.spinner.show();

      const formData = new FormData();
      formData.append('client_file', this.ideaFile.file);
      formData.append('scheme_file', this.schemeFile.file);
      formData.append('language', this.brdForm.value.language);

      this.http.post(`${this.apiUrl}/generate-grant`, formData).subscribe(
        (response: any) => {
          this.brdContent = response.proposal;
          this.spinner.hide();
        },
        error => {
          console.error('Error generating grant proposal:', error);
          this.spinner.hide();
        }
      );
    } else {
      alert('Please upload both files before processing.');
    }
  }

  generateGW(): void {


    this.spinner.show();

    const formData = {
      grant_proposal: this.brdContent,
      language: this.brdForm.value.language
    };


  }


  updateButtonStates(): void {
    const processButton = document.querySelector('.process') as HTMLButtonElement;
    processButton.disabled = this.uploadedFiles.length !== 2;
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  showTopLeft(): void {
    this.messageService.add({
      key: 'tl',  // 'tl' refers to the position key for top-left
      severity: 'info',
      summary: 'Logout Successful',
      detail: 'You have been successfully logged out.'
    });
  }

  // Logout function to clear local storage and show the toast message
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');

    // Show the toast message
    this.showTopLeft();

    // Navigate to the login page after showing the message
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);  // Delay for the toast message before redirection
  }

  openDownloadDialog(): void {
    this.displayDialog = true;
  }
  onCancel(): void {
    // Close the dialog without downloading
    this.displayDialog = false;
    this.fileName = ''; // Clear the input field
  }
  toggleEdit(): void {
    if (this.isEditing) {
      this.brdContent = this.editableContent;
    } else {
      this.editableContent = this.brdContent;
    }
    this.isEditing = !this.isEditing;
  }

  downloadGW(): void {
    if (!this.fileName || !this.fileName.trim()) {
      alert('Please provide a valid file name.');
      return;
    }

    const data = this.brdContent;

    // Download the text file
    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.fileName.trim()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    // Create and download the PDF
    const doc = new jsPDF();
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;
    const lines: string[] = doc.splitTextToSize(data, doc.internal.pageSize.width - 2 * margin);

    let cursorY = margin;
    lines.forEach((line: string) => {
      if (cursorY + 10 > pageHeight) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += 10;
    });

    // doc.save(`${this.fileName.trim()}.pdf`);

    // Show success toast message
    this.messageService.add({
      key: 'tl',
      severity: 'success',
      summary: 'File Download Successful',
      detail: `Your file "${this.fileName.trim()}" has been downloaded.`
    });

    // Close the dialog and clear fileName
    this.displayDialog = false;
    this.fileName = '';
  }

  // toggleEdit(): void {
  //   if (this.isEditing) {
  //     this.brdContent = this.editableContent;
  //   } else {
  //     this.editableContent = this.brdContent;
  //   }
  //   this.isEditing = !this.isEditing;
  // }

  // downloadGW(): void {
  //   if (!this.brdContent) {
  //     alert('No content available to download.');
  //     return;
  //   }

  //   const data = this.brdContent;
  //   const blob = new Blob([data], { type: 'text/plain' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `edited_grant_proposal_${this.brdForm.value.language}.txt`;
  //   document.body.appendChild(a);
  //   a.click();
  //   window.URL.revokeObjectURL(url);

  //   // Create and download the PDF
  //   const doc = new jsPDF();
  //   const margin = 10;
  //   const pageHeight = doc.internal.pageSize.height;
  //   const lines: string[] = doc.splitTextToSize(data, doc.internal.pageSize.width - 2 * margin);

  //   let cursorY = margin;

  //   lines.forEach((line: string) => {
  //     if (cursorY + 10 > pageHeight) {
  //       doc.addPage();
  //       cursorY = margin;
  //     }
  //     doc.text(line, margin, cursorY);
  //     cursorY += 10;
  //   });

  //   doc.save(`edited_grant_proposal_${this.brdForm.value.language}.pdf`);
  // }




  onDragOver(event: any) {
    event.preventDefault();
  }

  onDrop(event: any) {
    event.preventDefault();
    const files = event.dataTransfer.files;
    this.handleFiles(files);
  }



  private handleFiles(files: FileList): void {
    const newFiles = Array.from(files);

    if (newFiles.length + this.uploadedFiles.length > 2) {
      alert('You can upload a maximum of 2 files.');
      return;
    }

    newFiles.forEach(file => {
      if (!this.uploadedFiles.some(f => f.file.name === file.name)) {
        this.uploadedFiles.push({ file, uploadedTime: new Date() });
        this.uploadFile(file);
      }
    });

    this.updateButtonStates();
  }



}

