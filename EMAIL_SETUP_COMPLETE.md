# Email Sending Setup - Two Options

## ⚠️ Current Issue
The email_queue collection saves documents but doesn't automatically send emails. You need to either:
1. **Option A:** Deploy a Cloud Function (Recommended)
2. **Option B:** Use a third-party email service with API key

---

## OPTION A: Firebase Cloud Function (Recommended)

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase Functions
```bash
cd c:\Projects\aocs
firebase init functions
```
When prompted:
- Select JavaScript
- Say Yes to ESLint
- Say Yes to install dependencies

### Step 3: Create Email Function

Edit `functions/index.js`:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Email transporter (Gmail example - use your email service)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,      // Set in Firebase Config
    pass: process.env.EMAIL_PASSWORD   // Set in Firebase Config
  }
});

// Trigger when document added to email_queue
exports.sendAssessmentEmail = functions.firestore
  .document("email_queue/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();
    console.log("Processing email:", data);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: data.submitterEmail,  // User email
      bcc: data.recipientEmail, // Support email
      subject: `Your AI Readiness Assessment Results - Score: ${data.assessmentData.score}/100`,
      html: `
        <h2>Assessment Results for ${data.submitterName}</h2>
        <p><strong>Company:</strong> ${data.submitterName}</p>
        <p><strong>Industry:</strong> ${data.assessmentData.industry}</p>
        <p><strong>Team Size:</strong> ${data.assessmentData.teamSize}</p>
        <p><strong>AI Readiness Score:</strong> <strong>${data.assessmentData.score}/100</strong></p>
        <p><strong>Budget:</strong> ${data.assessmentData.budget}</p>
        <p><strong>Timeline:</strong> ${data.assessmentData.timeline}</p>
        <p>Our team will contact you within 24-48 hours with personalized recommendations.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      // Update status to 'sent'
      await snap.ref.parent.parent.collection("email_queue").doc(context.params.docId).update({ status: "sent" });
      console.log("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      await snap.ref.parent.parent.collection("email_queue").doc(context.params.docId).update({ status: "failed", error: error.message });
    }
  });
```

### Step 4: Install Dependencies in Functions
```bash
cd functions
npm install nodemailer
cd ..
```

### Step 5: Set Environment Variables

Create `functions/.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

**For Gmail:**
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password
4. Use that password in EMAIL_PASSWORD

### Step 6: Deploy
```bash
firebase deploy --only functions
```

---

## OPTION B: Email API Service

If you prefer not to use Cloud Functions, use an email API:

### SendGrid (Free tier available)

1. Sign up: https://sendgrid.com/
2. Get API key from dashboard
3. Update `firestore.service.ts`:

```typescript
triggerEmailNotification(assessment: AIAssessment, docId: string): Observable<any> {
  const apiKey = 'YOUR_SENDGRID_API_KEY';
  
  const emailData = {
    personalizations: [{
      to: [{ email: assessment.email }],
      bcc: [{ email: 'support@aocsai.com' }]
    }],
    from: { email: 'noreply@aocsai.com' },
    subject: `Your AI Readiness Assessment Results - Score: ${assessment.aiReadinessScore}/100`,
    content: [{
      type: 'text/html',
      value: `
        <h2>Assessment Results</h2>
        <p>Your AI Readiness Score: <strong>${assessment.aiReadinessScore}/100</strong></p>
        <p>Industry: ${assessment.industry}</p>
        <p>Our team will contact you within 24-48 hours.</p>
      `
    }]
  };

  return from(
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    }).then(r => {
      if (!r.ok) throw new Error('Email API failed');
      return r.json();
    })
  );
}
```

---

## ✅ Verification Steps

1. **Submit an assessment form**
2. **Go to Firebase Console → Firestore**
3. **Check `email_queue` collection**
4. **Look for the new document:**
   - Status should change from "pending" to "sent" (or "failed")
   - Check functions logs for errors

5. **Check your email:**
   - Both user and support@aocsai.com should receive emails
   - Check spam folder if not in inbox

---

## Troubleshooting

**Emails not sending after Cloud Function deployment?**

Check the functions logs:
```bash
firebase functions:log
```

Common issues:
- ❌ Wrong Gmail app password
- ❌ Email service not enabled in Firebase
- ❌ Incorrect email addresses
- ✅ Check the Firebase Console → Functions → Logs tab

**Still not working?**
- Use Option B (SendGrid) as a quick alternative
- SendGrid has better reliability
- Or contact Firebase support if deployment fails
