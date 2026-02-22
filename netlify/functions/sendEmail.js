


console.log('sendEmail function loaded');
if (process.env.BREVO_API_KEY) {
  const key = process.env.BREVO_API_KEY;
  const maskedKey = key.length > 8 ? key.slice(0, 4) + '...' + key.slice(-4) : key;
  console.log('BREVO_API_KEY: set, value (masked):', maskedKey);
} else {
  console.log('BREVO_API_KEY: NOT SET');
}
console.log('BREVO_SENDER_EMAIL:', process.env.BREVO_SENDER_EMAIL);
const { BrevoClient } = require('@getbrevo/brevo');

exports.handler = async (event) => {
  console.log('sendEmail handler invoked');
  let body;
  try {
    body = JSON.parse(event.body);
    console.log('Payload received:', body);
  } catch (err) {
    console.error('Failed to parse event.body:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON payload' }),
    };
  }

  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
    console.error('Missing BREVO_API_KEY or BREVO_SENDER_EMAIL');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing BREVO_API_KEY or BREVO_SENDER_EMAIL' }),
    };
  }

  const client = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });
  const emailsApi = client.transactionalEmails;

  const recipients = [
    { email: body.to },
    { email: "support@aocsai.com" }
  ];

  const sendSmtpEmail = {
    to: recipients,
    sender: { email: process.env.BREVO_SENDER_EMAIL },
    subject: body.subject,
    htmlContent: body.htmlContent,
    textContent: body.textContent || undefined,
  };

  console.log('Prepared sendSmtpEmail:', sendSmtpEmail);

  try {
    const result = await emailsApi.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo API result:', result);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Email sent successfully" }),
    };
  } catch (error) {
    console.error('Brevo API error:', error);
    if (error && error.response && error.response.body) {
      console.error('Brevo API error body:', error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message,
        details: error.response && error.response.body ? error.response.body : undefined
      }),
    };
  }
};
