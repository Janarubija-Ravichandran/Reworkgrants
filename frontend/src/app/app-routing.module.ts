import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { authGuard } from './auth.guard';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { UndefinedComponent } from './undefined/undefined.component';
import { MainComponent } from './main/main.component';
import { HeaderComponent } from './header/header.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserIdeaComponent } from './user-idea/user-idea.component';
import { GrantsComponent } from './grants/grants.component';
import { LayoutComponent } from './layout/layout.component';

// const routes: Routes = [
//   { path:'', redirectTo:'login', pathMatch:'full' },
//   { path:'login', component:LoginComponent },
//   { path:'register', component: RegisterComponent },
//   { path: 'file', component: FileUploadComponent },
//   { path: 'main', component: MainComponent },
//   { path: 'header', component: HeaderComponent },
//   { path: 'user-detail', component: UserDetailComponent },
//   { path: 'user-idea', component: UserIdeaComponent },
//   { path: 'grants', component: GrantsComponent },
//   { path:'**',component : UndefinedComponent},


// ];
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'file', component: FileUploadComponent },
      { path: 'main', component: MainComponent },
      { path: 'header', component: HeaderComponent },
      { path: 'user-detail', component: UserDetailComponent },
      { path: 'user-idea', component: UserIdeaComponent },
      { path: 'grants', component: GrantsComponent }
    ]
  },
  { path: '**', component: UndefinedComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
