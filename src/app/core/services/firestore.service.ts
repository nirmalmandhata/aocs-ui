

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
   * Send AI Fit Preview submission to support@aocsai.com
   */
  sendAiFitPreviewEmail(data: any): Observable<any> {
    // Email to support
    const supportSubject = 'New AI Fit Preview Submission';
    const supportHtml = `
      <h2>New AI Fit Preview Submission</h2>
      <p><strong>Team Size:</strong> ${data.teamSize}</p>
      <p><strong>Industry:</strong> ${data.industry}</p>
      <p><strong>Challenges:</strong> ${data.challenges?.join(', ')}</p>
      <p><strong>Goal:</strong> ${data.goal}</p>
      <p><strong>Email:</strong> ${data.email || 'N/A'}</p>
      <p><strong>Score:</strong> ${data.score}</p>
      <p><strong>Phase:</strong> ${data.phase}</p>
      <p><strong>Submitted At:</strong> ${data.createdAt}</p>
    `;
    const supportPayload = {
      to: 'support@aocsai.com',
      subject: supportSubject,
      htmlContent: supportHtml,
      textContent: `Team Size: ${data.teamSize}\nIndustry: ${data.industry}\nChallenges: ${(data.challenges||[]).join(', ')}\nGoal: ${data.goal}\nEmail: ${data.email || 'N/A'}\nScore: ${data.score}\nPhase: ${data.phase}\nSubmitted At: ${data.createdAt}`
    };

    // Email to user (if provided)
    let userPromise = Promise.resolve({});
    if (data.email) {
      const userSubject = 'Your AI Fit Preview Results';
      const userHtml = `
        <h2>Your AI Fit Preview Results</h2>
        <p>Thank you for using our AI Fit Preview tool!</p>
        <p><strong>Your Score:</strong> ${data.score}/100</p>
        <p><strong>Phase:</strong> ${data.phase}</p>
        <p>If you would like to discuss your results or explore how AI can help your team, please contact <a href="mailto:support@aocsai.com">support@aocsai.com</a>.</p>
        <hr>
        <p><strong>Team Size:</strong> ${data.teamSize}</p>
        <p><strong>Industry:</strong> ${data.industry}</p>
        <p><strong>Challenges:</strong> ${data.challenges?.join(', ')}</p>
        <p><strong>Goal:</strong> ${data.goal}</p>
        <p><strong>Submitted At:</strong> ${data.createdAt}</p>
      `;
      const userPayload = {
        to: data.email,
        subject: userSubject,
        htmlContent: userHtml,
        textContent: `Your AI Fit Preview Results\nScore: ${data.score}/100\nPhase: ${data.phase}\nContact support@aocsai.com for more info.\n---\nTeam Size: ${data.teamSize}\nIndustry: ${data.industry}\nChallenges: ${(data.challenges||[]).join(', ')}\nGoal: ${data.goal}\nSubmitted At: ${data.createdAt}`
      };
      userPromise = fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload)
      }).then(res => res.json());
    }

    // Send both emails (support and user if provided)
    return from(
      Promise.all([
        fetch('/.netlify/functions/sendEmail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(supportPayload)
        }).then(res => res.json()),
        userPromise
      ])
    );
  }

  /**
   * Save AI Fit Preview data to Firestore
   */
  saveAiFitPreview(data: any): Observable<DocumentReference> {
    return from(addDoc(collection(db, 'ai_fit_preview'), data));
  }

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
