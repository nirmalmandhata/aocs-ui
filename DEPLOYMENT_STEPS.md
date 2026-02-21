# Firebase Cloud Functions Deployment - Step-by-Step Guide

## ✅ Completed Steps

- [x] Firebase CLI installed (`firebase-tools`)
- [x] Functions folder created with all necessary files
- [x] Dependencies installed in functions folder
- [x] `.firebaserc` configured with project `aocs-3bd9f`
- [x] `index.js` with email handler function created
- [x] `.env` template created

## 📋 Remaining Steps

### Step 1: Authenticate with Firebase

In PowerShell, run:
```powershell
cd c:\Projects\aocs
npx firebase login
```

This will:
1. Open a browser (or provide a URL)
2. Ask you to sign in with your Google account
3. Grant Firebase CLI access to your projects
4. Return to PowerShell with confirmation

### Step 2: Sign Up for SendGrid (Free)

SendGrid is a free email service - **no Gmail 2FA needed!**

1. Go to https://sendgrid.com
2. Click **Sign Up**
3. Fill in your details and create an account
4. **Verify your email** (check your inbox)
5. Log in to https://app.sendgrid.com

### Step 3: Get SendGrid API Key

1. In SendGrid dashboard, go to **Settings** (left menu)
2. Click **API Keys**
3. Click **Create API Key**
4. Name it: `Firebase Functions`
5. Select **Full Access**
6. Click **Create & View**
7. **Copy the entire API key** (starts with `SG.`)

### Step 4: Configure .env File

Edit `c:\Projects\aocs\functions\.env`:

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=your-email@example.com
```

Replace:
- `SG.xxxxxxxxxxxxxxxxxxxxxxxxxx` with your API key from Step 3
- `your-email@example.com` with the email you signed up with on SendGrid

**Important:** This file is in `.gitignore` so it won't be committed to git.

### Step 5: Update Dependencies

In PowerShell:
```powershell
cd c:\Projects\aocs\functions
npm install
```

This installs SendGrid package.

### Step 6: Deploy Cloud Functions

```powershell
cd c:\Projects\aocs
npx firebase deploy --only functions
```

You should see:
```
✔ functions[sendEmailFromQueue]: Successful create operation.
✔ functions[triggerEmailManually]: Successful create operation.
```

### Step 7: Verify Deployment

Check functions are deployed:
```powershell
npx firebase functions:list
```

You should see:
```
sendEmailFromQueue
triggerEmailManually
```

## 🧪 Testing the Email Functionality

Now test by submitting the assessment form:

1. Go to http://localhost:4200/ai-assessment
2. Fill out the form with your test email
3. Click "Calculate AI Readiness Score"
4. You should see the success page
5. **Check your email inbox** - you should receive the assessment results within 5-10 seconds
6. Check `support@aocsai.com` - should also receive a notification

### Monitor Email Sending

Option A: View function logs in Firebase Console
- Go to Firebase Console → Functions → sendEmailFromQueue → Logs

Option B: Use CLI
```powershell
npx firebase functions:log --lines=50
```

## ❌ Troubleshooting

### Issue: "missing or insufficient permission"
- Make sure Firestore rules are set to `allow read, write;`
- Check `c:\Projects\aocs\VERIFY_FIREBASE_RULES.md`

### Issue: "Authentication required" during deploy
- Run `npx firebase login` again
- You may need to clear saved auth: `npx firebase logout` then `npx firebase login`

### Issue: "Unauthorized" error in function logs
- Verify SENDGRID_API_KEY is correct (copy directly from SendGrid)
- Make sure you didn't add extra spaces in .env file
- Verify your email is verified in SendGrid

### Issue: Emails not sending after deployment
- Check `npx firebase functions:log` for error messages
- Verify .env file format (no spaces around `=`)
- Confirm SENDGRID_FROM_EMAIL matches your SendGrid account email
- Ensure SENDGRID_API_KEY starts with `SG.`

### Issue: "Cannot find module '@sendgrid/mail'"
- Run `cd c:\Projects\aocs\functions; npm install` again
- Check that `node_modules/@sendgrid` exists

## 📊 Status Check

You can verify everything is working by checking the Firestore console:

1. Go to Firebase Console (https://console.firebase.google.com)
2. Select project **aocs-3bd9f**
3. Go to **Firestore Database**
4. Check collection **email_queue**
5. Click on a document
6. Look for field **status**: 
   - `sent` = Email successfully delivered
   - `failed` = Email failed (check error field)

## ✨ Success Indicators

You'll know everything is working when:

✅ Assessment form submits without errors
✅ Success page displays your score
✅ Email arrives in your inbox within 10 seconds
✅ Email also arrives in `support@aocsai.com`
✅ Firestore `email_queue` document shows `status: "sent"`
✅ Cloud Functions logs show `✅ Emails sent successfully`

---

**Once deployed, your AI Assessment feature is fully functional!**
