import sgMail from '@sendgrid/mail';

const apiKey = process.env.SENDGRID_API_KEY || 'SG.mock-key';
sgMail.setApiKey(apiKey);

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM_EMAIL || 'orders@nexora.com',
      subject,
      html,
    };
    
    // We only send if the key doesn't look like our mock key
    if (!apiKey.includes('mock')) {
      await sgMail.send(msg);
      console.log(`Email sent to ${to}`);
    } else {
      console.log(`[SIMULATED EMAIL] To: ${to} | Subject: ${subject}`);
    }
  } catch (error: any) {
    console.error('SendGrid Error:', error.response?.body || error.message);
  }
};
