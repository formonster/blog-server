import { VerificationCode } from '@/model/VerificationCode';
import { Response } from '@/types/IData'
import { BaseServiceImpl } from './BaseServiceImpl';

export type VerificationCodeType = "PHOME" | "EMAIL";

export default interface VerificationCodeServiceImpl extends BaseServiceImpl {
    addCode(recipient: string, type: VerificationCodeType, code?: string): Promise<Response<VerificationCode>>
    /**
     * 验证输入的验证码是否正确
     * @param id 标识
     * @param code 验证码
     */
    checkVerificationCode(id: string, code: string): Promise<Response<boolean>>
    /**
     * 激活邮箱
     * @param recipient 收件人
     * @param code 验证码
     */
     activeEmail(recipient: string, code: string): Promise<Response<boolean>>
}