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
   * Send email notification about assessment submission
   * This can be implemented via Firestore triggers or Cloud Functions
   */
  triggerEmailNotification(assessment: AIAssessment, docId: string): Observable<any> {
    // Create a document in a collection that Cloud Function monitors
    return from(addDoc(collection(db, 'email_queue'), {
      recipientEmail: 'support@aocsai.com',
      submitterEmail: assessment.email,
      submitterName: assessment.companyName,
      assessmentId: docId,
      assessmentData: {
        companyName: assessment.companyName,
        industry: assessment.industry,
        teamSize: assessment.teamSize,
        budget: assessment.budget,
        timeline: assessment.timeline,
        score: assessment.aiReadinessScore
      },
      createdAt: new Date().toISOString(),
      status: 'pending'
    }));
  }
}
