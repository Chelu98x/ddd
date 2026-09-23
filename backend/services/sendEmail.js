const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
        console.warn('Email credentials missing. Skipping email delivery for:', options?.userEmail);
        return null;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user,
            pass,
        },
    });

    const mailOptions = {
        from: user,
        to: options.userEmail,
        subject: options.subject,
        text: options.text,
    };

    await transporter.sendMail(mailOptions);
    return true;
};

module.exports = sendEmail;
