import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header.component';
import { FooterComponent } from './components/footer.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { LoadingSpinnerComponent } from './components/loading-spinner.component';

import { HomeComponent } from './pages/home/home.component';
import { AiDevelopmentComponent } from './pages/ai-development/ai-development.component';
import { ServicesComponent } from './pages/services/services.component';
import { UseCasesComponent } from './pages/use-cases/use-cases.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AIAssessmentComponent } from './pages/ai-assessment/ai-assessment.component';
import { AssessmentSuccessComponent } from './pages/assessment-success/assessment-success.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'ai-development', component: AiDevelopmentComponent },
      { path: 'services', component: ServicesComponent },
      { path: 'use-cases', component: UseCasesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'ai-assessment', component: AIAssessmentComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    LoadingSpinnerComponent,
    HomeComponent,
    AiDevelopmentComponent,
    ServicesComponent,
    UseCasesComponent,
    AboutComponent,
    ContactComponent,
    AIAssessmentComponent,
    AssessmentSuccessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

