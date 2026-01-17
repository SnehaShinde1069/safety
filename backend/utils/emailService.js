const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendAlertEmail = async (to, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: to,
      subject: subject,
      html: htmlContent
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

const getEmergencyAlertHTML = (userData, incidentData, videoUrl) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
          .container { background-color: white; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
          .header { background-color: #d32f2f; color: white; padding: 15px; border-radius: 5px; }
          .content { margin: 20px 0; }
          .alert-box { background-color: #fff3cd; border-left: 4px solid #d32f2f; padding: 10px; margin: 10px 0; }
          .info-field { margin: 10px 0; }
          .button { display: inline-block; background-color: #d32f2f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🚨 EMERGENCY ALERT - Girl Safety System</h2>
          </div>
          <div class="content">
            <p>An emergency alert has been triggered. Please take immediate action.</p>
            
            <div class="alert-box">
              <strong>Alert Details:</strong>
              <div class="info-field"><strong>User:</strong> ${userData.fullName}</div>
              <div class="info-field"><strong>Contact:</strong> ${userData.phone}</div>
              <div class="info-field"><strong>Email:</strong> ${userData.email}</div>
              <div class="info-field"><strong>Location:</strong> ${incidentData.location}</div>
              <div class="info-field"><strong>Time:</strong> ${new Date(incidentData.timestamp).toLocaleString()}</div>
              <div class="info-field"><strong>Incident Type:</strong> ${incidentData.type}</div>
            </div>

            ${videoUrl ? `<p><a href="${videoUrl}" class="button">View Incident Video</a></p>` : ''}

            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
              <strong>Next Steps:</strong>
              <ul>
                <li>Verify the incident immediately</li>
                <li>Check the video footage if available</li>
                <li>Contact the user if needed</li>
                <li>Dispatch emergency services if required</li>
              </ul>
            </div>
          </div>
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #666;">
            <p>This is an automated emergency alert from the Girl Safety System. Please respond promptly.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

const getIncidentConfirmationHTML = (incidentId) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          .container { background-color: white; padding: 20px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
          .success { color: #4caf50; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="success">✓ Emergency Alert Received</h2>
          <p>Your emergency alert has been received and recorded.</p>
          <p><strong>Incident ID:</strong> ${incidentId}</p>
          <p>Emergency services and your emergency contacts have been notified.</p>
          <p>Help is on the way. Stay safe.</p>
        </div>
      </body>
    </html>
  `;
};

module.exports = {
  sendAlertEmail,
  getEmergencyAlertHTML,
  getIncidentConfirmationHTML,
  transporter
};
