import { Response } from '@/types/IData';
import BaseService from './BaseService';
import VerificationCodeServiceImpl, { VerificationCodeType } from './VerificationCodeServiceImpl'
import { resError, resSuccess, resWarning } from '@/utils/common';
import { numberCode } from '@/utils/math';
import { VerificationCode } from '@/model/VerificationCode';
import { Table } from '@/types/table';
import { checkResultError } from '@/utils/check';

class VerificationCodeService extends BaseService implements VerificationCodeServiceImpl {

    tableName: Table = "thtt_verification_code"

    async activeEmail(recipient: string, code: string): Promise<Response<boolean>> {
        // 1. 查询并检查状态
        // 2. 未激活则激活，已激活则提示已激活
        const res = await this.get<VerificationCode>({
            where: { recipient, code }
        })

        const { id, status } = res.data

        if (status === 1) return resWarning("该账号已激活！");

        const putRes = await this.put({
            data: { status: 1 },
            where: { id, recipient, code }
        })

        if (checkResultError(putRes)) return resWarning(putRes.message);

        const putUserRes = await this.put({
            table: "thtt_user",
            data: { email_auth: "AUTHENTICATION_SUCCESSFUL" },
            where: { account: recipient, is_delete: 0 }
        })

        if (checkResultError(putUserRes)) return resWarning(putUserRes.message);

        return resSuccess(true)
    }

    addCode(recipient: string, type: VerificationCodeType, code?: string): Promise<Response<VerificationCode>> {
        if (!code) code = numberCode();
        return this.add<VerificationCode>({
            data: { code, type, recipient }
        })
    }

    async checkVerificationCode(id: string, code: string): Promise<Response<boolean>> {
        const res = await this.get<VerificationCode>({
            where: { id }
        })

        const _code = res.data.code;
        return resSuccess(code === _code);
    }
}

export default VerificationCodeService;