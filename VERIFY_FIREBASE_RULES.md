# Verify Firebase Rules Are Deployed

If you're still getting "missing or insufficient permission" errors, the rules might not be deployed. Follow these steps to verify:

## Step 1: Check Current Rules in Firebase Console

1. Go to https://console.firebase.google.com/
2. Select **aocs-3bd9f** project
3. Click **Firestore Database** in left sidebar
4. Click **Rules** tab at the top
5. **Look at the rules editor** - You should see something like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ai_assessments/{document=**} {
      allow read, write: if true;
    }
```

If you see the **default rules** (something with `if request.auth != null`), then YOUR RULES ARE NOT DEPLOYED.

---

## Step 2: If Rules Aren't Deployed - Do This Now

1. In the Rules editor, **SELECT ALL** (Ctrl+A)
2. **DELETE** everything
3. **PASTE** this exact text:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ai_assessments/{document=**} {
      allow read, write;
    }
    
    match /email_queue/{document=**} {
      allow read, write;
    }
  }
}
```

4. Click the **PUBLISH** button (bottom right, blue button)
5. Wait for green notification: **"Rules published successfully"**
6. **CLOSE the Firebase console tab**

---

## Step 3: Test Your Form

1. Go back to your assessment form tab: http://localhost:4200/ai-assessment
2. **Refresh the page** (F5)
3. **Wait 10 seconds** for rules to take effect globally
4. Fill out the form
5. Click **"Calculate AI Readiness Score"** button
6. Form should submit successfully ✓

---

## If STILL Getting Error After Publishing

Try these steps:

### Clear Browser Cache & Reload
1. Press **F12** to open DevTools
2. Right-click on the refresh button
3. Click **"Empty cache and hard refresh"**
4. Or press **Ctrl+Shift+Delete** to clear cache

### Check Browser Console for Actual Error
1. Press **F12** to open DevTools
2. Click **Console** tab
3. Look for red error messages
4. Copy the full error message
5. Share it with me

---

## Final Verification Checklist

Before submitting the form:

- [ ] I opened Firebase Console at https://console.firebase.google.com/
- [ ] I selected the **aocs-3bd9f** project
- [ ] I went to **Firestore Database → Rules** tab
- [ ] I see the rules with `match /ai_assessments/` in them (NOT the default rules)
- [ ] I clicked **PUBLISH** and got a green "published successfully" notification
- [ ] I waited at least 10 seconds
- [ ] I refreshed my form page
- [ ] I cleared browser cache with hard refresh (Ctrl+Shift+Delete)

If all boxes are checked and you STILL get the error, let me know and we have an alternative solution.

---

## Need Help?

If the PUBLISH button isn't appearing or grayed out:
- Make sure you're signed into Firebase with the RIGHT Google account
- Make sure the tab shows "Rules" (not "Indexes" or "Data")
- Try refreshing the Firebase console page

Get the exact error from browser console (F12) and share it with me.
