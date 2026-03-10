import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FirestoreService } from '../core/services/firestore.service';
import { AiFitPreview } from '../core/models/ai-fit-preview.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-fit-preview',
  templateUrl: './ai-fit-preview.component.html',
  styleUrls: ['./ai-fit-preview.component.scss']
})
export class AiFitPreviewComponent implements OnInit {
  step = 1;
  loading = false;
  score: number | null = null;
  phase: string = '';
  recommendations: string[] = [];
  resultData: any = null;

  teamSizes = ['1–10', '10–50', '50–200', '200+'];
  challengesList = [
    'Too much manual work',
    'Customer support overload',
    'Reporting delays',
    'Scaling inefficiencies',
    'Data scattered across tools'
  ];
  goals = [
    'Reduce operational cost',
    'Improve efficiency',
    'Automate workflows',
    'Improve customer experience'
  ];

  form: FormGroup = this.fb.group({
    teamSize: ['', Validators.required],
    industry: ['', [Validators.required, Validators.minLength(2)]],
    challenges: this.fb.array([], Validators.required),
    goal: ['', Validators.required],
    email: ['', Validators.email]
  });

  constructor(
    private fb: FormBuilder,
    private firestoreService: FirestoreService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {}

  get challengesFormArray() {
    return this.form.get('challenges') as FormArray;
  }

  toggleChallenge(challenge: string) {
    const arr = this.challengesFormArray;
    const idx = arr.value.indexOf(challenge);
    if (idx > -1) {
      arr.removeAt(idx);
    } else {
      arr.push(this.fb.control(challenge));
    }
    arr.markAsTouched();
  }

  nextStep() {
    if (this.step === 1 && this.form.get('teamSize')?.valid && this.form.get('industry')?.valid) {
      this.step = 2;
    } else if (this.step === 2 && this.challengesFormArray.valid) {
      this.step = 3;
    }
  }

  prevStep() {
    if (this.step > 1) this.step--;
  }

  submit() {
    if (this.form.invalid) return;
    this.loading = true;
    const val = this.form.value;
    // Scoring logic
    let score = 0;
    switch (val.teamSize) {
      case '1–10': score += 10; break;
      case '10–50': score += 25; break;
      case '50–200': score += 40; break;
      case '200+': score += 50; break;
    }
    score += (val.challenges.length * 10);
    switch (val.goal) {
      case 'Reduce operational cost': score += 10; break;
      case 'Improve efficiency': score += 20; break;
      case 'Automate workflows': score += 30; break;
      case 'Improve customer experience': score += 20; break;
    }
    if (score > 100) score = 100;
    // Phase
    let phase = '';
    if (score <= 40) phase = 'Exploration Phase';
    else if (score <= 70) phase = 'Growth Phase';
    else phase = 'Optimization Phase';
    // Recommendations
    this.recommendations = this.getRecommendations(score);
    this.score = score;
    this.phase = phase;
    this.resultData = { ...val, score, phase };
    // Save to Firestore if email
    const doc: AiFitPreview = {
      teamSize: val.teamSize,
      industry: val.industry,
      challenges: val.challenges,
      goal: val.goal,
      email: val.email,
      score,
      phase,
      createdAt: new Date().toISOString()
    };
    this.firestoreService.saveAiFitPreview(doc).subscribe({
      next: () => {
        // Prepare support email payload
        const supportSubject = 'New AI Fit Preview Submission';
        const supportHtml = `
          <h2>New AI Fit Preview Submission</h2>
          <p><strong>Team Size:</strong> ${doc.teamSize}</p>
          <p><strong>Industry:</strong> ${doc.industry}</p>
          <p><strong>Challenges:</strong> ${doc.challenges?.join(', ')}</p>
          <p><strong>Goal:</strong> ${doc.goal}</p>
          <p><strong>Email:</strong> ${doc.email || 'N/A'}</p>
          <p><strong>Score:</strong> ${doc.score}</p>
          <p><strong>Phase:</strong> ${doc.phase}</p>
          <p><strong>Submitted At:</strong> ${doc.createdAt}</p>
        `;
        const supportPayload = {
          to: 'support@aocsai.com',
          subject: supportSubject,
          htmlContent: supportHtml,
          textContent: `Team Size: ${doc.teamSize}\nIndustry: ${doc.industry}\nChallenges: ${(doc.challenges||[]).join(', ')}\nGoal: ${doc.goal}\nEmail: ${doc.email || 'N/A'}\nScore: ${doc.score}\nPhase: ${doc.phase}\nSubmitted At: ${doc.createdAt}`
        };

        // Prepare user email payload (if provided)
        let userObs = null;
        if (doc.email) {
          const userSubject = 'Your AI Fit Preview Results';
          const userHtml = `
            <h2>Your AI Fit Preview Results</h2>
            <p>Thank you for using our AI Fit Preview tool!</p>
            <p><strong>Your Score:</strong> ${doc.score}/100</p>
            <p><strong>Phase:</strong> ${doc.phase}</p>
            <p>If you would like to discuss your results or explore how AI can help your team, please contact <a href="mailto:support@aocsai.com">support@aocsai.com</a>.</p>
            <hr>
            <p><strong>Team Size:</strong> ${doc.teamSize}</p>
            <p><strong>Industry:</strong> ${doc.industry}</p>
            <p><strong>Challenges:</strong> ${doc.challenges?.join(', ')}</p>
            <p><strong>Goal:</strong> ${doc.goal}</p>
            <p><strong>Submitted At:</strong> ${doc.createdAt}</p>
          `;
          const userPayload = {
            to: doc.email,
            subject: userSubject,
            htmlContent: userHtml,
            textContent: `Your AI Fit Preview Results\nScore: ${doc.score}/100\nPhase: ${doc.phase}\nContact support@aocsai.com for more info.\n---\nTeam Size: ${doc.teamSize}\nIndustry: ${doc.industry}\nChallenges: ${(doc.challenges||[]).join(', ')}\nGoal: ${doc.goal}\nSubmitted At: ${doc.createdAt}`
          };
          userObs = this.http.post('/.netlify/functions/sendEmail', userPayload);
        }

        // Send support email, then user email if present
        this.http.post('/.netlify/functions/sendEmail', supportPayload).subscribe({
          next: () => {
            if (userObs) {
              userObs.subscribe({
                next: () => this.loading = false,
                error: () => this.loading = false
              });
            } else {
              this.loading = false;
            }
          },
          error: () => this.loading = false
        });
      },
      error: () => this.loading = false
    });
  }

  getRecommendations(score: number): string[] {
    if (score <= 40) {
      return [
        'Start with AI education and awareness workshops.',
        'Identify manual processes for pilot automation.',
        'Assess data readiness for future AI projects.'
      ];
    } else if (score <= 70) {
      return [
        'Prioritize workflow automation pilots.',
        'Invest in data integration and quality.',
        'Build cross-functional AI champions.'
      ];
    } else {
      return [
        'Scale successful pilots across teams.',
        'Implement advanced AI-driven analytics.',
        'Focus on continuous improvement and governance.'
      ];
    }
  }

  reset() {
    this.form.reset();
    this.step = 1;
    this.score = null;
    this.phase = '';
    this.recommendations = [];
    this.resultData = null;
  }

  goToAssessment() {
    this.router.navigate(['/ai-assessment']);
  }

  goToContact() {
    this.router.navigate(['/contact']);
  }
}
