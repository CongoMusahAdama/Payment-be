import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Brevo API client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;



const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();


// Function to send verification code
export const sendVerificationCode = async (email, verificationCode) => {
  const sender = { email: process.env.EMAIL_USER, name: "Your App Name" };
  const receivers = [{ email }];

  const emailContent = {
    sender,
    to: receivers,
    subject: "Your MFA Verification Code",
    htmlContent: `<p>Your One-Time Password (OTP) is: <strong>${verificationCode}</strong></p>`,
  };

  try {
    console.log("Sending email to:", email); // Log the email being sent
    await apiInstance.sendTransacEmail(emailContent);
    console.log(`MFA Code sent to ${email}`);
  } catch (error) {
    console.error("Error sending MFA email:", error.response ? error.response.body : error.message);

    throw new Error("Failed to send MFA email");
  }
};
