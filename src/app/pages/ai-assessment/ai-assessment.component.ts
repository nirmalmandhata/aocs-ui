import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../../core/services/firestore.service';
import { AIAssessmentService } from '../../core/services/assessment.service';
import { AIAssessment } from '../../core/models/ai-assessment.model';
import { AssessmentSuccessComponent } from '../assessment-success/assessment-success.component';

@Component({
  selector: 'app-ai-assessment',
  templateUrl: './ai-assessment.component.html',
  styleUrls: ['./ai-assessment.component.css']
})
export class AIAssessmentComponent implements OnInit {
  @ViewChild(AssessmentSuccessComponent) successComponent!: AssessmentSuccessComponent;

  assessmentForm!: FormGroup;
  isLoading = false;
  showSuccess = false;
  successData: any = {};

  industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Retail',
    'Manufacturing',
    'Education',
    'Logistics',
    'Real Estate',
    'Energy',
    'Other'
  ];

  budgetOptions = [
    { label: 'Under $50K', value: 'under_50k' },
    { label: '$50K - $100K', value: '50k_100k' },
    { label: '$100K - $250K', value: '100k_250k' },
    { label: '$250K - $500K', value: '250k_500k' },
    { label: 'Above $500K', value: 'above_500k' }
  ];

  timelineOptions = [
    { label: 'Less than 3 months', value: 'less_3_months' },
    { label: '3 - 6 months', value: '3_6_months' },
    { label: '6 - 12 months', value: '6_12_months' },
    { label: 'More than 12 months', value: 'above_12_months' }
  ];

  techStackOptions = [
    { label: 'Cloud Infrastructure (AWS, Azure, GCP)', value: 'cloud_infrastructure' },
    { label: 'AI/ML Tools (TensorFlow, PyTorch)', value: 'ai_ml_tools' },
    { label: 'API Platforms & Integration', value: 'api_platforms' },
    { label: 'Microservices Architecture', value: 'microservices' },
    { label: 'DevOps & CI/CD', value: 'devops' },
    { label: 'Database (SQL/NoSQL)', value: 'database' },
    { label: 'Mobile Development', value: 'mobile_dev' },
    { label: 'Web Technologies (React, Angular, Vue)', value: 'web_frameworks' }
  ];

  challengeOptions = [
    { label: 'Legacy System Integration', value: 'legacy_integration' },
    { label: 'Data Quality & Governance', value: 'data_quality' },
    { label: 'Skills Gap', value: 'skills_gap' },
    { label: 'Budget Constraints', value: 'budget_constraints' },
    { label: 'Time Constraints', value: 'time_constraints' },
    { label: 'Organizational Resistance', value: 'org_resistance' },
    { label: 'Security & Compliance', value: 'security_compliance' },
    { label: 'Infrastructure Limitations', value: 'infra_limitations' }
  ];

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private assessmentService: AIAssessmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.assessmentForm = this.fb.group({
      companyName: ['', [Validators.required, Validators.minLength(2)]],
      industry: ['', Validators.required],
      teamSize: ['', [Validators.required, Validators.min(1), Validators.max(10000)]],
      email: ['', [Validators.required, Validators.email]],
      techStack: [[], Validators.required],
      challenges: [[], Validators.required],
      budget: ['', Validators.required],
      timeline: ['', Validators.required]
    });
  }

  get challengesArray(): any[] {
    return this.assessmentForm.get('challenges')?.value || [];
  }

  get techStackArray(): any[] {
    return this.assessmentForm.get('techStack')?.value || [];
  }

  toggleChallenge(value: string): void {
    const challenges = this.assessmentForm.get('challenges')?.value || [];
    const index = challenges.indexOf(value);
    if (index > -1) {
      challenges.splice(index, 1);
    } else {
      challenges.push(value);
    }
    this.assessmentForm.patchValue({ challenges });
  }

  toggleTechStack(value: string): void {
    const techStack = this.assessmentForm.get('techStack')?.value || [];
    const index = techStack.indexOf(value);
    if (index > -1) {
      techStack.splice(index, 1);
    } else {
      techStack.push(value);
    }
    this.assessmentForm.patchValue({ techStack });
  }

  onSubmit(): void {
    if (this.assessmentForm.invalid) {
      this.markFormGroupTouched(this.assessmentForm);
      return;
    }

    this.isLoading = true;

    const formValue = this.assessmentForm.value;
    const assessmentData: Omit<AIAssessment, 'aiReadinessScore'> = {
      companyName: formValue.companyName,
      industry: formValue.industry,
      teamSize: parseInt(formValue.teamSize, 10),
      email: formValue.email,
      techStack: formValue.techStack,
      challenges: formValue.challenges,
      budget: formValue.budget,
      timeline: formValue.timeline
    };

    const score = this.assessmentService.calculateReadinessScore(assessmentData);
    const assessmentWithScore: AIAssessment = { ...assessmentData, aiReadinessScore: score };

    // Save to Firestore
    this.firestoreService.saveAssessment(assessmentWithScore).subscribe({
      next: (docRef) => {
        console.log('Assessment saved successfully:', docRef.id);
        
        // Trigger email notification (fire and forget)
        this.firestoreService.triggerEmailNotification(assessmentWithScore, docRef.id).subscribe({
          next: () => {
            console.log('Email notification queued');
          },
          error: (emailError) => {
            console.warn('Email notification setup warning:', emailError);
          }
        });

        // Show success regardless of email status
        setTimeout(() => {
          this.isLoading = false;
          this.successData = {
            score,
            companyName: formValue.companyName,
            email: formValue.email,
            industry: formValue.industry,
            teamSize: formValue.teamSize,
            budget: this.budgetOptions.find(b => b.value === formValue.budget)?.label || formValue.budget
          };
          this.showSuccess = true;
          window.scrollTo(0, 0);
        }, 500);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error saving assessment:', error);
        alert('Failed to submit assessment. Please check your internet connection and try again.\n\nError: ' + (error.message || 'Unknown error'));
      }
    });
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.assessmentForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.assessmentForm.get(fieldName);
    if (field?.hasError('required')) return 'This field is required';
    if (field?.hasError('minlength')) return 'Input too short';
    if (field?.hasError('email')) return 'Invalid email format';
    if (field?.hasError('min')) return 'Value must be greater than 0';
    if (field?.hasError('max')) return 'Value exceeds maximum';
    return '';
  }
}
