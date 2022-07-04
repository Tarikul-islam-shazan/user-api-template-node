import * as nodemailer from 'nodemailer';
import * as smtpTransport from "nodemailer-smtp-transport";
import { ConfigService } from "@nestjs/config";

function getConfigService(value) {
    let configService = new ConfigService();
    return configService.get(value);
}

const mailTransporter = nodemailer.createTransport(smtpTransport({
    port: getConfigService('SMTP_PORT'),
    secure: true,
    service: getConfigService('SMTP_SERVICE'),
    auth: {
        user: getConfigService('SMTP_USER'),
        pass: getConfigService('SMTP_USER_PASS')
    },
    tls: {
        rejectUnauthorized: true,
    },
}));
export default mailTransporter;
