import type { Request, Response } from 'express';

export default async function handler(req: Request | any, res: Response | any) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, message, recipientName } = req.body || {};

  // Input validation
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return res.status(400).json({ error: 'Valid recipient email (to) is required.' });
  }

  if (!subject || typeof subject !== 'string' || subject.trim().length === 0) {
    return res.status(400).json({ error: 'Email subject is required.' });
  }

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'Email message body is required.' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.error('[SERVER ERROR] RESEND_API_KEY environment variable is missing.');
    return res.status(500).json({
      error: 'RESEND_API_KEY is not configured on the server. Please add RESEND_API_KEY to environment variables.',
    });
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey.trim()}`,
      },
      body: JSON.stringify({
        from: 'Interact Club JPS <onboarding@resend.dev>',
        to: [to],
        subject: subject.trim(),
        text: message.trim(),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error('[RESEND API ERROR]', data);
      return res.status(response.status || 500).json({
        error: data.message || data.error || 'Failed to send email via Resend API',
      });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err: any) {
    console.error('[EMAIL HANDLER EXCEPTION]', err);
    return res.status(500).json({ error: err?.message || 'Server error while sending email' });
  }
}
