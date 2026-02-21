## Deploy Firestore Security Rules

To fix the "missing or insufficient permission" error, you need to deploy the Firestore security rules. Follow these steps:

### Option 1: Firebase CLI (Recommended)

1. Install Firebase CLI globally (if not already installed):
```bash
npm install -g firebase-tools
```

2. Initialize Firebase in your project directory:
```bash
firebase init firestore
```

3. When prompted, select the project `aocs-3bd9f`

4. The firestore.rules file is already created in the project root

5. Deploy the rules:
```bash
firebase deploy --only firestore:rules
```

### Option 2: Firebase Console (Manual)
1. Go to Firebase Console: https://console.firebase.google.com/
2. Select project `aocs-3bd9f`
3. Go to Firestore Database → Rules tab
4. Replace the default rules with the content from `firestore.rules`
5. Click "Publish"

### Rules Explanation
The rules allow:
- ✅ Anyone to read and write to `ai_assessments` collection
- ✅ Anyone to read and write to `email_queue` collection
- ✅ Works for development/testing

### Production Security (Later)
For production, you should update the rules to require authentication instead of allowing anonymous writes. Update rules to:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /ai_assessments/{document=**} {
      allow write: if request.auth != null;
      allow read: if request.auth != null;
    }
  }
}
```
