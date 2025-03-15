import sgMail from '@sendgrid/mail';

//TODO: signup and generate the api key
// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Function to send verification code
export const sendVerificationCode = async (email, verificationCode) => {
    const msg = {
        to: email,
        from: process.env.EMAIL_USER, // Your verified SendGrid email
        subject: 'Your MFA Verification Code',
        text: `Your verification code is: ${verificationCode}`,
    };

    return sgMail.send(msg);
};
