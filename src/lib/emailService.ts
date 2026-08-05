export interface SendEmailParams {
  to: string;
  subject: string;
  message: string;
  recipientName?: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
}

/**
 * Calls backend API endpoint POST /api/send-email (which uses server-side RESEND_API_KEY).
 */
export async function sendEmail({ to, subject, message, recipientName }: SendEmailParams): Promise<SendEmailResult> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        message,
        recipientName,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Failed to send email' };
    }
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.error('[EMAIL DISPATCH NETWORK ERROR]', err);
    }
    return { success: false, error: err?.message || 'Network error sending email' };
  }
}

/**
 * Sends notification email to atharvnegi26@gmail.com when a new volunteer application is submitted.
 */
export async function sendAdminNewVolunteerNotification(payload: {
  full_name: string;
  class_section: string;
  email: string;
  phone: string;
  interests: string;
  reason_to_join: string;
  availability?: string;
}): Promise<SendEmailResult> {
  const adminEmail = 'atharvnegi26@gmail.com';
  const subject = 'New Interact Club Volunteer Application';
  const message = `New Interact Club Volunteer Application Received:

Full Name: ${payload.full_name}
Class & Section: ${payload.class_section}
Email: ${payload.email}
Phone: ${payload.phone}
Interests: ${payload.interests || 'None specified'}
Reason to Join: ${payload.reason_to_join}
Availability: ${payload.availability || 'N/A'}`;

  return sendEmail({
    to: adminEmail,
    subject,
    message,
    recipientName: 'Interact Club Admin',
  });
}

/**
 * Sends status update email to the applicant when status is changed to accepted, contacted, or rejected.
 */
export async function sendApplicantStatusEmail(
  applicantEmail: string,
  fullName: string,
  status: 'accepted' | 'contacted' | 'rejected'
): Promise<SendEmailResult> {
  let subject = '';
  let message = '';

  if (status === 'accepted') {
    subject = 'Interact Club Volunteer Application Accepted';
    message = `Dear ${fullName},

Thank you for your interest in joining the Interact Club of Jagran Public School, Noida.

We are pleased to inform you that your volunteer application has been accepted. Further details will be shared through official club communication.

Regards,
Interact Club of Jagran Public School, Noida`;
  } else if (status === 'contacted') {
    subject = 'Interact Club Volunteer Application Update';
    message = `Dear ${fullName},

Thank you for your interest in joining the Interact Club of Jagran Public School, Noida.

Your application has been reviewed, and the club team may contact you for further details.

Regards,
Interact Club of Jagran Public School, Noida`;
  } else if (status === 'rejected') {
    subject = 'Interact Club Volunteer Application Update';
    message = `Dear ${fullName},

Thank you for your interest in joining the Interact Club of Jagran Public School, Noida.

At this time, your application has not been selected. We appreciate your willingness to contribute and encourage you to participate in future opportunities.

Regards,
Interact Club of Jagran Public School, Noida`;
  } else {
    return { success: true };
  }

  return sendEmail({
    to: applicantEmail,
    subject,
    message,
    recipientName: fullName,
  });
}
