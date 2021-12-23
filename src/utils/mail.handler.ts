import mailTransporter from "./mail.config";

export const sendMail = async ({ toMail, subject, fromMail, textBody, htmlBody }:
    { toMail: any, subject: string, fromMail?: string, textBody?: string, htmlBody?: any }) => {
    try {
        return await mailTransporter.sendMail({
            from: fromMail ? fromMail : process.env.FROM_MAIL_ID,
            to: toMail,
            subject,
            text: textBody ? textBody : null,
            html: htmlBody ? htmlBody : null,
        });
    } catch (error) {
        throw error;
    }
};
