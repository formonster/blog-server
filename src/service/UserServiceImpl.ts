import { User } from '@/model/User';
import { Response } from '@/types/IData'
import { Where } from '@/utils/sql'

export type LoginRes = { user: User, token: string };

export default interface UserServiceImpl {
    /**
     * 统计总数
     * @param where 额外的查询条件
     */
    totalCount(where?: Where): Promise<Response<number>>;
    /**
     * 统计年新增
     * @param where 额外的查询条件
     */
    yearAddCount(where?: Where): Promise<Response<number>>;
    /**
     * 统计月新增
     * @param where 额外的查询条件
     */
    mouthAddCount(where?: Where): Promise<Response<number>>;
    login(account: string, password: string): Promise<Response<LoginRes>>
    register(account: string, password: string): Promise<Response<User>>
    /**
     * 判断账号是否存在
     * @param account 用户账号
     */
    isExist(account: string): Promise<Response<boolean>>
}