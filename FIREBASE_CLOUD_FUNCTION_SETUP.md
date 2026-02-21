# Option A: Firebase Cloud Function Email Setup

Follow these exact steps to enable automatic email sending.

---

## Step 1: Install Firebase CLI

Open PowerShell and run:

```powershell
npm install -g firebase-tools
```

Verify installation:
```powershell
firebase --version
```

---

## Step 2: Login to Firebase

```powershell
firebase login
```

This will open a browser to authenticate with your Google account.

---

## Step 3: Initialize Cloud Functions

Navigate to your project and initialize:

```powershell
cd c:\Projects\aocs
firebase init functions
```

When prompted:
- ✅ Select your project: **aocs-3bd9f**
- ✅ Choose language: **JavaScript**
- ✅ Use ESLint: **Yes**
- ✅ Install dependencies: **Yes**

This creates a `functions/` folder in your project.

---

## Step 4: Install Nodemailer

Open PowerShell in the functions folder:

```powershell
cd c:\Projects\aocs\functions
npm install nodemailer
cd ..
```

---

## Step 5: Create the Email Function

Replace the contents of `functions/index.js` with this code:

```javascript
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Cloud Function triggered when document is added to email_queue
exports.sendAssessmentEmail = functions.firestore
  .document("email_queue/{docId}")
  .onCreate(async (snap, context) => {
    try {
      const data = snap.data();
      console.log("📧 Processing email for:", data.submitterEmail);

      // Email to submitter
      const userEmailOptions = {
        from: process.env.EMAIL_USER,
        to: data.submitterEmail,
        subject: `Your AI Readiness Assessment Results - Score: ${data.assessmentData.score}/100`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Assessment Results</h2>
            <p>Dear ${data.submitterName},</p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 10px 0;"><strong>Company:</strong> ${data.submitterName}</p>
              <p style="margin: 10px 0;"><strong>Industry:</strong> ${data.assessmentData.industry}</p>
              <p style="margin: 10px 0;"><strong>Team Size:</strong> ${data.assessmentData.teamSize} members</p>
              <p style="margin: 10px 0;"><strong>Budget:</strong> ${data.assessmentData.budget}</p>
              <p style="margin: 10px 0;"><strong>Timeline:</strong> ${data.assessmentData.timeline}</p>
              <p style="margin: 10px 0; font-size: 24px; color: #059669;"><strong>AI Readiness Score: ${data.assessmentData.score}/100</strong></p>
            </div>
            
            <p>Our team will review your assessment and contact you within 24-48 hours with personalized AI implementation recommendations.</p>
            <p>Thank you for using our AI Readiness Assessment tool!</p>
          </div>
        `
      };

      // Email to support team
      const supportEmailOptions = {
        from: process.env.EMAIL_USER,
        to: "support@aocsai.com",
        subject: `New Assessment Submission - ${data.submitterName}`,
        html: `
          <h3>New Assessment Submitted</h3>
          <p><strong>Company:</strong> ${data.submitterName}</p>
          <p><strong>Email:</strong> ${data.submitterEmail}</p>
          <p><strong>Industry:</strong> ${data.assessmentData.industry}</p>
          <p><strong>Team Size:</strong> ${data.assessmentData.teamSize}</p>
          <p><strong>Budget:</strong> ${data.assessmentData.budget}</p>
          <p><strong>Timeline:</strong> ${data.assessmentData.timeline}</p>
          <p><strong>Score:</strong> ${data.assessmentData.score}/100</p>
          <p><strong>Assessment ID:</strong> ${data.assessmentId}</p>
        `
      };

      // Send both emails
      await Promise.all([
        transporter.sendMail(userEmailOptions),
        transporter.sendMail(supportEmailOptions)
      ]);

      console.log("✅ Emails sent successfully to", data.submitterEmail, "and support@aocsai.com");

      // Update status to 'sent'
      await snap.ref.update({ 
        status: "sent",
        sentAt: new Date().toISOString()
      });

    } catch (error) {
      console.error("❌ Error sending email:", error);
      
      // Update status to 'failed' with error message
      await snap.ref.update({ 
        status: "failed",
        error: error.message,
        failedAt: new Date().toISOString()
      });
    }
  });
```

---

## Step 6: Set Environment Variables

### Get Gmail App Password

1. Go to https://myaccount.google.com/
2. Click **Security** in left menu
3. Enable **2-Step Verification** if not already enabled
4. Click **App passwords** (appears after 2FA is enabled)
5. Select **Mail** and **Windows Computer**
6. Google will generate a 16-character password - **copy it**

### Create .env File

Create file: `functions/.env`

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
```

**Example:**
```
EMAIL_USER=aocsai@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

---

## Step 7: Deploy Cloud Function

Run this command from `c:\Projects\aocs`:

```powershell
firebase deploy --only functions
```

You'll see output like:
```
✔  Deploy complete!

Project Console: https://console.firebase.google.com/project/aocs-3bd9f/overview
Function URL (sendAssessmentEmail(us-central1)): https://us-central1-aocs-3bd9f.cloudfunctions.net/sendAssessmentEmail
```

✅ **Deployment complete!**

---

## Step 8: Test the Function

1. Go to your form: http://localhost:4200/ai-assessment
2. Fill out the form completely
3. Submit the assessment
4. Check your email inbox (and spam folder)

---

## Step 9: Verify in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select project **aocs-3bd9f**
3. Click **Functions** in left sidebar
4. Click **sendAssessmentEmail**
5. Go to **Logs** tab - you'll see:
   - ✅ "Processing email for: user@company.com"
   - ✅ "Emails sent successfully..."

---

## Troubleshooting

### ❌ Function not deploying?

Check for errors:
```powershell
firebase deploy --only functions --debug
```

### ❌ Emails not sending after deployment?

1. **Check function logs:**
   - Firebase Console → Functions → sendAssessmentEmail → Logs
   - Look for error messages

2. **Common issues:**
   - ❌ Wrong Gmail app password → Get new one from https://myaccount.google.com/apppasswords
   - ❌ 2FA not enabled → Enable it first
   - ❌ Gmail blocking → Allow "less secure apps" is deprecated; use app passwords
   - ❌ Wrong email format in .env → Remove spaces around `=`

3. **Check email_queue collection:**
   - Firebase Console → Firestore → email_queue
   - Look for status field (should be "sent" or "failed")

### ❌ Getting "Module not found" error?

Make sure nodemailer is installed:
```powershell
cd c:\Projects\aocs\functions
npm install nodemailer
```

### ❌ Still having issues?

Run this to see all function logs in real-time:
```powershell
firebase functions:log
```

---

## Success Indicators ✅

When it works, you should see:

1. ✅ Form submits successfully
2. ✅ Success page displays
3. ✅ Email arrives in inbox within seconds
4. ✅ Firebase logs show "Emails sent successfully"
5. ✅ email_queue document status = "sent"
6. ✅ Both user and support@aocsai.com receive emails
