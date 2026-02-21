import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AIAssessmentService } from '../../core/services/assessment.service';

@Component({
  selector: 'app-assessment-success',
  template: `
    <div class="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 sm:p-6">
      <div class="max-w-2xl mx-auto">
        <!-- Success Card - Compact -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white text-center">
            <div class="flex justify-center mb-2">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
              </svg>
            </div>
            <h1 class="text-lg sm:text-xl font-bold">Assessment Submitted!</h1>
            <p class="text-xs text-green-100">Your AI readiness assessment has been received</p>
          </div>

          <!-- Content - Very Compact -->
          <div class="p-4 sm:p-5">
            
            <!-- Score Display - Simple -->
            <div class="text-center mb-4 pb-4 border-b border-gray-200">
              <p class="text-xs text-gray-600 uppercase mb-2">AI Readiness Score</p>
              <div class="flex justify-center items-baseline gap-1">
                <span class="text-4xl font-bold" [style.color]="assessmentService.getReadinessColor(score)">{{ score }}</span>
                <span class="text-sm text-gray-600">/100</span>
              </div>
              <p class="text-sm font-semibold mt-2" [style.color]="assessmentService.getReadinessColor(score)">
                {{ assessmentService.getReadinessLevel(score) }}
              </p>
            </div>

            <!-- Email Info -->
            <div class="bg-blue-50 border border-blue-200 rounded p-3 mb-3 text-xs">
              <p class="font-semibold text-blue-900 mb-1">✓ Results sent to:</p>
              <p class="text-blue-800 break-all">{{ email }}</p>
            </div>

            <!-- Summary Grid - Compact -->
            <div class="grid grid-cols-2 gap-2 mb-3 text-xs">
              <div class="bg-gray-50 p-2 rounded">
                <p class="text-gray-600">Company</p>
                <p class="font-medium text-gray-900">{{ companyName }}</p>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <p class="text-gray-600">Industry</p>
                <p class="font-medium text-gray-900">{{ industry }}</p>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <p class="text-gray-600">Team Size</p>
                <p class="font-medium text-gray-900">{{ teamSize }} members</p>
              </div>
              <div class="bg-gray-50 p-2 rounded">
                <p class="text-gray-600">Budget</p>
                <p class="font-medium text-gray-900">{{ budget }}</p>
              </div>
            </div>

            <!-- Message -->
            <div class="bg-indigo-50 border border-indigo-200 rounded p-3 mb-4 text-xs text-indigo-900">
              <p class="font-semibold mb-1">Next Steps:</p>
              <p>Our team will contact you within 24-48 hours with recommendations.</p>
            </div>

            <!-- Buttons - Compact -->
            <div class="grid grid-cols-2 gap-2">
              <button
                (click)="goHome()"
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-xs rounded transition"
              >
                Home
              </button>
              <button
                (click)="newAssessment()"
                class="bg-gray-300 hover:bg-gray-400 text-gray-900 font-semibold py-2 text-xs rounded transition"
              >
                New
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class AssessmentSuccessComponent {
  @Input() score = 0;
  @Input() companyName = '';
  @Input() email = '';
  @Input() industry = '';
  @Input() teamSize = 0;
  @Input() budget = '';

  constructor(
    private router: Router,
    public assessmentService: AIAssessmentService
  ) { }

  goHome(): void {
    this.router.navigate(['/']);
  }

  newAssessment(): void {
    this.router.navigate(['/ai-assessment']);
  }
}
