import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from './material-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { SidebarModule } from 'primeng/sidebar';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadComponent } from './file-upload/file-upload.component';
  import { NgxSpinnerModule } from 'ngx-spinner';
  import { TooltipModule } from 'primeng/tooltip';
  import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';
import { UndefinedComponent } from './undefined/undefined.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { SpeedDialModule } from 'primeng/speeddial';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserIdeaComponent } from './user-idea/user-idea.component';
import { GrantsComponent } from './grants/grants.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    FileUploadComponent,
    UndefinedComponent,
    MainComponent,
    HeaderComponent,
    UserDetailComponent,
    UserIdeaComponent,
    GrantsComponent,
  ],
  imports: [
    OverlayPanelModule,
    SpeedDialModule,
    DialogModule,
    ToastModule,
    AvatarGroupModule,
    TooltipModule,
    AvatarModule,
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    InputTextareaModule,
    SidebarModule,
    DropdownModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
