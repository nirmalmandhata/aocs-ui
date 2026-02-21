const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

// Initialize Firebase
admin.initializeApp();

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Cloud Function to send emails from email_queue collection
exports.sendEmailFromQueue = functions.firestore
  .document("email_queue/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    // Skip if already processed
    if (data.status === "sent" || data.status === "failed") {
      console.log(`Email ${context.params.docId} already processed, skipping.`);
      return;
    }

    try {
      const { userEmail, supportEmail, subject, htmlBody, companyName } = data;

      // Email to user
      await sgMail.send({
        to: userEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: subject,
        html: htmlBody,
      });

      console.log(`✅ Email sent to user: ${userEmail}`);

      // Email to support
      await sgMail.send({
        to: supportEmail,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject: `[ASSESSMENT] ${companyName} - AI Readiness Assessment Submission`,
        html: `
          <h2>New Assessment Submission</h2>
          <p><strong>Company:</strong> ${data.companyName}</p>
          <p><strong>User Email:</strong> ${userEmail}</p>
          <p><strong>Industry:</strong> ${data.industry}</p>
          <p><strong>Team Size:</strong> ${data.teamSize}</p>
          <p><strong>Score:</strong> ${data.score}/100</p>
          <p><strong>Budget Range:</strong> ${data.budget}</p>
          <p><strong>Timeline:</strong> ${data.timeline}</p>
          <hr>
          <p>Please review the full assessment details in the Firestore console.</p>
        `,
      });

      console.log(`✅ Email sent to support: ${supportEmail}`);

      // Update document status
      await snap.ref.update({
        status: "sent",
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log(`✅ Emails sent successfully for assessment ${context.params.docId}`);
      return { success: true, docId: context.params.docId };

    } catch (error) {
      console.error(`❌ Error sending email for ${context.params.docId}:`, error);

      // Update document with error status
      try {
        await snap.ref.update({
          status: "failed",
          error: error.message,
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        console.error("Failed to update document status:", updateError);
      }

      // Rethrow to signal function failure
      throw error;
    }
  });

// Optional: Trigger emails manually via HTTP
exports.triggerEmailManually = functions.https.onCall(async (data, context) => {
  // Optional: Check authentication
  // if (!context.auth) {
  //   throw new functions.https.HttpsError('unauthenticated', 'User not authenticated');
  // }

  try {
    const { userEmail, subject, htmlBody, companyName } = data;

    await sgMail.send({
      to: userEmail,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: subject,
      html: htmlBody,
    });

    console.log(`✅ Manual email sent to: ${userEmail}`);

    return { success: true, email: userEmail };
  } catch (error) {
    console.error("❌ Error sending manual email:", error);
    throw new functions.https.HttpsError("internal", error.message);
  }
});
