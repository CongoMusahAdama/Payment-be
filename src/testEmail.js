import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
const apiKey = SibApiV3Sdk.ApiClient.instance.authentications["api-key"];


apiKey.apiKey = process.env.BREVO_API_KEY;

const sendTestEmail = async () => {
    const sender = { email: process.env.EMAIL_USER, name: "Test Sender" };
    const receivers = [{ email: process.env.EMAIL_USER }];

    const emailContent = {
        sender,
        to: receivers,
        subject: "Test Email",
        htmlContent: "<p>This is a test email to verify the API key.</p>",
    };

    try {
        await apiInstance.sendTransacEmail(emailContent);
        console.log("Test email sent successfully!");
    } catch (error) {
        console.error("Error sending test email:", error.response?.body || error.message);
    }
};

sendTestEmail();
