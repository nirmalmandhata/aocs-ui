import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AiFitPreviewComponent } from './ai-fit-preview.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: AiFitPreviewComponent }
];

@NgModule({
  declarations: [AiFitPreviewComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class AiFitPreviewModule {}
