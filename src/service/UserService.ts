import { User } from '@/model/User';
import { Response } from '@/types/IData';
import { Table } from '@/types/table';
import { resSuccess } from '@/utils/common';
import { yearAgo, monthAgo, ms2m } from '@/utils/date';
import { Where } from '@/utils/sql';
import BaseService from './BaseService';
import UserServiceImpl, { LoginRes } from './UserServiceImpl'

const TABLE_NAME = "thtt_user";

class IndexService extends BaseService implements UserServiceImpl {

    tableName: Table = "thtt_user";

    login(account: string, password: string): Promise<Response<LoginRes>> {
        throw new Error('Method not implemented.');
    }
    register(account: string, password: string): Promise<Response<User>> {
        throw new Error('Method not implemented.');
    }
    async isExist(account: string): Promise<Response<boolean>> {
        const res = await this.list({
            columns: ["user_id"],
            where: { account, is_delete: 0 }
        })
        return resSuccess(!!res.data.length);
    }
    async totalCount(where: Where): Promise<Response<number>> {
        return await this.count({
            table: TABLE_NAME,
            where: { is_delete: 0, ...where }
        })
    }
    async yearAddCount(where: Where): Promise<Response<number>> {
        return await this.count({
            table: TABLE_NAME,
            where: {
                is_delete: 0,
                add_time: {
                    condition: ">",
                    value: ms2m(yearAgo())
                },
                ...where
            }
        })
    }
    async mouthAddCount(where: Where): Promise<Response<number>> {
        return await this.count({
            table: TABLE_NAME,
            where: {
                is_delete: 0,
                add_time: {
                    condition: ">",
                    value: ms2m(monthAgo())
                },
                ...where
            }
        })
    }
}

export default IndexService;