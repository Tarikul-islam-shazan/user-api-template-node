import * as nodemailer from 'nodemailer';
import * as smtpTransport from "nodemailer-smtp-transport";

const mailTransporter = nodemailer.createTransport(smtpTransport({
    // host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // true for 465, false for other ports
    service: process.env.SMTP_SERVICE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_USER_PASS,
    },
    tls: {
        rejectUnauthorized: true,
    },
}));
export default mailTransporter;
