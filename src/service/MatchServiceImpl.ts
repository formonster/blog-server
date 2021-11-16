import { Response } from '@/types/IData'
import { BaseServiceImpl } from './BaseServiceImpl';

export type MatchResult = {
    hasParams: boolean;
    matchResult: {}[]
}

export default interface MatchServiceImpl extends BaseServiceImpl {
    /**
     * 查询是否选择了订阅菜单
     * @param userId 用户标识
     */
    hasMatchParams(userId: string, type: number): Promise<Response<boolean>>
    /**
     * 匹配
     * @param userId 用户标识
     */
    match(userId: string, type: number): Promise<Response<MatchResult>>
}