import { htmlToText } from 'html-to-text';
import nodemailer from 'nodemailer';
import { Lang } from '../../../src/types';
import { REGISTER_POST, FORGOT_PASSWORD } from '../../../src/routes';
import config from '../config';
import { auth, functions, HttpsError } from '../firebase';
import { getResetEmail, getVerifyEmailTemplate } from './templates';

type MailOptions = {
    html: string;
    subject: string;
    to: string;
};

type AuthHandlerParams = { origin: string; continuePath: string; lang: Lang };

const sendMail = async ({ html, subject, to }: MailOptions) => {
    const transport = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        auth: {
            user: config.smtp.user,
            pass: config.smtp.password,
        },
    });

    await transport.sendMail({
        from: config.smtp.from,
        subject,
        to,
        html,
        text: htmlToText(html),
    });
};

export const sendEmailVerification = functions.https.onCall(
    async ({ origin, continuePath, lang }: AuthHandlerParams, context) => {
        const userId = context.auth?.uid;

        if (!userId) {
            throw new Error(`User not logged in.`);
        }

        const user = await auth.getUser(userId);

        if (!user.email) {
            throw new Error(`User ${userId} has no email to verify.`);
        }

        const verificationLink = await auth.generateEmailVerificationLink(user.email, { url: origin + continuePath });
        const params = new URL(verificationLink).searchParams;
        const url = new URL(origin + REGISTER_POST);
        url.search = params.toString();

        const { html, subject } = getVerifyEmailTemplate({
            recipientName: user.displayName || user.email,
            lang,
            link: url.toString(),
        });

        await sendMail({ html, subject, to: user.email });
    }
);

export const sendPasswordResetMail = functions.https.onCall(
    async ({ email, origin, continuePath, lang }: AuthHandlerParams & { email: string }) => {
        let user;

        try {
            user = await auth.getUserByEmail(email);
        } catch (error) {
            return;
        }

        const resetLink = await auth.generatePasswordResetLink(email, { url: origin + continuePath });

        const params = new URL(resetLink).searchParams;
        const url = new URL(origin + FORGOT_PASSWORD);
        url.search = params.toString();

        const { html, subject } = getResetEmail({
            recipientName: user.displayName || user.email!,
            lang,
            link: url.toString(),
        });

        await sendMail({ html, subject, to: user.email! });
    }
);