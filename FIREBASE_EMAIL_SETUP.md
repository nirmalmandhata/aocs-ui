# Firebase Cloud Function for Email Notifications

This guide explains how to set up a Cloud Function to send automatic emails when assessments are submitted.

## Setup Steps

### 1. Install Firebase Cloud Functions

```bash
npm install -g firebase-tools
firebase login
firebase init functions
```

### 2. Create the Cloud Function

Create or update `functions/src/index.ts`:

```typescript
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";

admin.initializeApp();

// Configure your email service (Gmail or SendGrid)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD
  }
});

export const sendAssessmentEmailNotification = functions.firestore
  .document("email_queue/{docId}")
  .onCreate(async (snap, context) => {
    const emailData = snap.data();

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: [emailData.recipientEmail, emailData.submitterEmail],
      subject: `AI Readiness Assessment Report - ${emailData.submitterName}`,
      html: generateEmailTemplate(emailData)
    };

    try {
      await transporter.sendMail(mailOptions);
      
      // Update status to sent
      await snap.ref.parent.parent?.update({
        [`email_queue/${context.params.docId}`]: {
          ...emailData,
          status: "sent",
          sentAt: admin.firestore.FieldValue.serverTimestamp()
        }
      });
      
      console.log("Email sent successfully for assessment:", context.params.docId);
    } catch (error) {
      console.error("Error sending email:", error);
      // Update status to failed
      await snap.ref.parent.parent?.update({
        [`email_queue/${context.params.docId}`]: {
          ...emailData,
          status: "failed",
          error: error.message
        }
      });
    }
  });

function generateEmailTemplate(emailData: any): string {
  const { submitterName, assessmentData } = emailData;
  const { companyName, industry, teamSize, budget, timeline, score } = assessmentData;

  const readinessLevel = getReadinessLevel(score);
  const readinessColor = getReadinessColor(score);

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border-radius: 8px; }
          .header { background: linear-gradient(to right, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 8px; margin-bottom: 30px; }
          .score-section { text-align: center; margin: 30px 0; }
          .score-circle { display: inline-block; width: 150px; height: 150px; border-radius: 50%; background-color: #f0f0f0; display: flex; flex-direction: column; align-items: center; justify-content: center; margin: 20px 0; }
          .score-number { font-size: 48px; font-weight: bold; color: ${readinessColor}; }
          .score-label { font-size: 14px; color: #666; }
          .summary { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .summary-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
          .summary-label { font-weight: bold; color: #666; }
          .summary-value { color: #333; }
          .next-steps { background-color: #f0f9ff; border-left: 4px solid #3b82f6; padding: 15px; border-radius: 4px; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>AI Readiness Assessment Report</h1>
            <p>Thank you for completing the assessment</p>
          </div>

          <h2>Hello ${submitterName},</h2>
          <p>Thank you for taking the time to complete the AI Readiness Assessment for ${companyName}. We're pleased to share your results below.</p>

          <div class="score-section">
            <h3>Your AI Readiness Score</h3>
            <div class="score-circle">
              <div class="score-number">${score}</div>
              <div class="score-label">out of 100</div>
            </div>
            <h2 style="color: ${readinessColor};">${readinessLevel}</h2>
          </div>

          <div class="summary">
            <h3>Assessment Summary</h3>
            <div class="summary-row">
              <span class="summary-label">Company</span>
              <span class="summary-value">${companyName}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Industry</span>
              <span class="summary-value">${industry}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Team Size</span>
              <span class="summary-value">${teamSize} members</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Budget Range</span>
              <span class="summary-value">${budget}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Implementation Timeline</span>
              <span class="summary-value">${timeline}</span>
            </div>
          </div>

          <div class="next-steps">
            <h4>Next Steps</h4>
            <p>Our AI implementation experts will review your assessment and reach out within 24-48 hours with personalized recommendations tailored to your organization's readiness level and specific needs.</p>
          </div>

          <p>If you have any questions about your assessment results, please don't hesitate to reach out to us at support@aocsai.com.</p>

          <div class="footer">
            <p>This is an automated message from Art of Coding Solutions AI (AOCS.AI)</p>
            <p>&copy; 2026 AOCS.AI. All rights reserved. | aocsai.com</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getReadinessLevel(score: number): string {
  if (score >= 80) return "Highly Ready";
  if (score >= 60) return "Ready";
  if (score >= 40) return "Emerging";
  return "Beginner";
}

function getReadinessColor(score: number): string {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#3b82f6";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}
```

### 3. Update Environment Variables

Create `.env.local` in your functions directory with:

```
ADMIN_EMAIL=your-email@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-specific-password
```

Or set them via Firebase CLI:

```bash
firebase functions:config:set email.admin=your-email@gmail.com
firebase functions:config:set email.password=your-app-password
```

### 4. Deploy the Function

```bash
cd functions
npm install
firebase deploy --only functions
```

### 5. Alternative: Use SendGrid

Replace the transporter configuration:

```typescript
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY
  }
});
```

## How It Works

1. When an assessment is submitted, the component calls `triggerEmailNotification()`
2. This creates a document in the `email_queue` collection
3. The Cloud Function triggers automatically on document creation
4. It sends an email to both the support team and the submitter
5. Status is updated to "sent" or "failed"

## Gmail Setup (If Using Gmail)

1. Enable 2-Factor Authentication on Gmail
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password as ADMIN_EMAIL_PASSWORD

## Testing

Test locally:

```bash
firebase emulators:start
```

Then submit a test assessment to trigger the function.

## Firestore Security Rules

Update your Firestore rules to allow creating documents in email_queue:

```javascript
match /email_queue/{document=**} {
  allow create: if true; // Read from function
  allow read: if request.auth.token.admin == true; // Only admins can read
  allow update: if request.auth.token.admin == true;
  allow delete: if request.auth.token.admin == true;
}
```

## Troubleshooting

- **Function not triggering**: Check function logs in Firebase Console → Functions
- **Email not sending**: Verify SMTP credentials and check function logs
- **Emails in spam**: Use SendGrid or configure DKIM/SPF records

## Email Template Customization

Edit the `generateEmailTemplate()` function to match your branding and include:
- Company logo
- Custom styling
- Additional sections (roadmap, next steps, etc.)
- Call-to-action buttons
