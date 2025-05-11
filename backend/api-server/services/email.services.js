import nodemailer from 'nodemailer';


const sendEmail = async (email, name) => {
  let sent = 0;
  let failed = 0;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GOOGLE_EMAIL,
    to: email,
    subject: 'Campaign Notification',
    text: `Hello ${name},\n\nYou have been selected for a special campaign!`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}: ${info.response}`);
    sent++;
  } catch (error) {
    console.log(`Failed to send email to ${email}: ${error}`);
    failed++;
  }

  return { sent, failed };
};

export default sendEmail;