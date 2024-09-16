import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService]

})
export class AppComponent {
  constructor(private messageService: MessageService) {}

  title = 'Grant Write';

  showSuccess() {
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
  }
}
