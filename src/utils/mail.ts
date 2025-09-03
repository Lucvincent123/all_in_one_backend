import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

type option = {
    email: string;
    subject: string;
    message: string;
    html?: string;
};

export const sendEmail = async (option: option) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const emailOptions = {
        from: `"Thiện Võ Trung" <${process.env.EMAIL_USERNAME}>`,
        to: option.email,
        subject: option.subject,
        text: option.message,
        html: option.html,
    };

    await transporter.sendMail(emailOptions);
};
