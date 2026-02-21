# Firebase Security Rules - Quick Deploy Guide

## CRITICAL: You MUST Deploy Security Rules First

The "missing or insufficient permission" error means your Firestore database doesn't have the right access rules. Follow these steps:

---

## Step 1: Go to Firebase Console

Open your browser and go to:
```
https://console.firebase.google.com/
```

**Sign in with the Google account that owns your Firebase project.**

---

## Step 2: Select Your Project

1. You should see your projects listed
2. Click on **"aocs-3bd9f"** project

---

## Step 3: Navigate to Firestore Rules

In the left sidebar:
1. Look for **"Firestore Database"** (or click "Build" menu → "Firestore Database")
2. Click on it to open Firestore
3. At the top, click the **"Rules"** tab (next to "Data", "Indexes", "Backups")

---

## Step 4: Copy and Paste the Rules

**Delete everything in the rules editor** and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ai_assessments/{document=**} {
      allow read, write: if true;
    }
    
    match /email_queue/{document=**} {
      allow read, write: if true;
    }
  }
}
```

---

## Step 5: Publish the Rules

Click the **"Publish"** button at the bottom right.

You should see a green notification saying "Rules published successfully"

---

## Step 6: Test Your Form

Go back to your app at:
```
http://localhost:4200/ai-assessment
```

Submit the form again - it should now work without permission errors!

---

## Troubleshooting

**Still getting permission error?**
- Make sure you're signed into Firebase Console with the SAME Google account
- Make sure you clicked "Publish" (not just edit)
- Wait 30 seconds and refresh your form page
- Check browser console (F12) - look for error messages

**Can't find Firestore Database?**
- Click the menu icon (☰) at top left
- Scroll down to "Build" section
- Click "Firestore Database"

---

## What These Rules Mean

- ✅ Anyone can **read** and **write** to ai_assessments collection
- ✅ Anyone can **read** and **write** to email_queue collection
- ⚠️ This is for **development only** - does NOT require authentication

For production, you would add authentication rules, but for now this allows testing.
