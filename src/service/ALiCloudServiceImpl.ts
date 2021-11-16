import { Response } from '@/types/IData'
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export default interface EmailServiceImpl {
    /**
     * 发送验证码
     * @param recipient 收件人
     * @param code 验证码
     */
    sendCode(recipient: string, code: string): Promise<Response<unknown>>;
}