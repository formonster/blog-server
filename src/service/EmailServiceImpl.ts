import { Response } from '@/types/IData'
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default interface EmailServiceImpl {
    /**
     * 发送邮件
     * @param recipient 收件人
     * @param subject 发送的主题
     * @param html 发送的html内容
     */
    send(recipient: string, subject: string, html: string): Promise<Response<SMTPTransport.SentMessageInfo>>;
    /**
     * 发送验证码
     * @param recipient 收件人
     * @param code 验证码
     */
    sendCode(recipient: string, code: string): Promise<Response<SMTPTransport.SentMessageInfo>>;
    /**
     * 发送激活链接
     * @param recipient 收件人
     * @param code 验证码
     */
    sendActiveLink(recipient: string, code: string): Promise<Response<SMTPTransport.SentMessageInfo>>;
}