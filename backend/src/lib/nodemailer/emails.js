import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";
import { sendMail } from "./nodemailer.js";

export async function sendVerificationEmail(toEmail, verificationCode, fullName) {
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationCode).replace("{fullName}", fullName);
    await sendMail(toEmail, "Verify Your Email", htmlContent);
}

export async function sendPasswordResetEmail(toEmail, resetURL, fullName) {
    
    const htmlContent = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{fullName}", fullName);
    await sendMail(toEmail, "Password Reset Request", htmlContent);
}

export async function sendPasswordResetSuccessEmail(toEmail, fullName) {
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace("{fullName}", fullName);
    await sendMail(toEmail, "Password Reset Successful", htmlContent);
}