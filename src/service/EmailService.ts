import { Response } from '@/types/IData';
import BaseService from './BaseService';
import EmailServiceImpl from './EmailServiceImpl'
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import emailConfig from '@/config/email'
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { resError, resSuccess } from '@/utils/common';

const smtpTransportTarget = nodemailer.createTransport(smtpTransport({
    host: 'smtp.163.com',
    secure: true,
    auth: {
        user: emailConfig.user,
        pass: emailConfig.pass
    }
}));

class EmailService extends BaseService implements EmailServiceImpl {
    sendActiveLink(recipient: string, code: string): Promise<Response<SMTPTransport.SentMessageInfo>> {
        return this.send(recipient, emailConfig.codeTitle, emailConfig.activeLinkTemplate(emailConfig.activeLinkHost, recipient, code))
    }
    sendCode(recipient: string, code: string): Promise<Response<SMTPTransport.SentMessageInfo>> {
        return this.send(recipient, emailConfig.codeTitle, emailConfig.codeTemplate(code))
    }
    send(recipient: string, subject: string, html: string): Promise<Response<SMTPTransport.SentMessageInfo>> {
        if (!recipient) throw new Error("请录入收件人！");

        return new Promise((resolve, reject) => {

            smtpTransportTarget.sendMail({
                from: emailConfig.user,
                to: recipient,
                subject: subject,
                html: html
            }, function (error, response) {
                if (error) {
                    console.log("send Email", error);
                    reject(resError(error.message));
                    return;
                }
                resolve(resSuccess(response));
            });
        })
    }
}

export default EmailService;