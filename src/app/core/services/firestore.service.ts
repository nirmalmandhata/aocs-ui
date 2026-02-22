import { Injectable } from '@angular/core';
import { db } from '../config/firebase.config';
import { collection, addDoc, DocumentReference } from 'firebase/firestore';
import { from, Observable } from 'rxjs';
import { AIAssessment } from '../models/ai-assessment.model';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor() { }

  /**
   * Save AI assessment data to Firestore
   */
  saveAssessment(assessmentData: AIAssessment): Observable<DocumentReference> {
    const timestamp = new Date().toISOString();
    
    return from(addDoc(collection(db, 'ai_assessments'), {
      ...assessmentData,
      createdAt: timestamp,
      updatedAt: timestamp,
      status: 'submitted'
    }));
  }

  /**
   * Send email notification using Netlify function (Brevo)
   */
  sendEmailViaNetlify(assessment: AIAssessment): Observable<any> {
    const subject = 'Your AI Readiness Assessment Submission';
    const htmlContent = `
      <h2>Thank you for your submission!</h2>
      <p>Dear ${assessment.companyName},</p>
      <p>We have received your AI Readiness Assessment. Our team will review your submission and get back to you soon.</p>
      <hr>
      <p><strong>Industry:</strong> ${assessment.industry}</p>
      <p><strong>Team Size:</strong> ${assessment.teamSize}</p>
      <p><strong>Score:</strong> ${assessment.aiReadinessScore}/100</p>
      <p><strong>Budget Range:</strong> ${assessment.budget}</p>
      <p><strong>Timeline:</strong> ${assessment.timeline}</p>
      <hr>
      <p>If you have any questions, please contact support@aocsai.com.</p>
    `;
    const payload = {
      to: assessment.email,
      subject,
      htmlContent,
      textContent: `Thank you for your submission! Your AI Readiness Score is ${assessment.aiReadinessScore}/100.`
    };
    return from(fetch('/.netlify/functions/sendEmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(res => res.json()));
  }
}
