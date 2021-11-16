import { Response } from '@/types/IData';
import { resSuccess } from '@/utils/common';
import { yearAgo, monthAgo, ms2m } from '@/utils/date';
import { Where } from '@/utils/sql';
import BaseService from './BaseService';
import ResultServiceImpl, { ScopeCountProps, ScopeCountRes } from './ResultServiceImpl'

const TABLE_NAME = "thtt_chengguo";

class IndexService extends BaseService implements ResultServiceImpl {
    totalCount(where: Where): Promise<Response<number>> {
        return this.count({
            table: TABLE_NAME,
            where: { is_delete: 0, ...where }
        })
    }
    yearAddCount(where: Where): Promise<Response<number>> {
        return this.count({
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
    mouthAddCount(where: Where): Promise<Response<number>> {
        return this.count({
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
    async scopeCount(scopes: ScopeCountProps, where?: Where): Promise<Response<ScopeCountRes>> {

        if (!scopes.length) return Promise.resolve(resSuccess([]));

        const scopesPromise = scopes.map(scope => this.count({
            table: TABLE_NAME,
            where: {
                ...where,
                is_delete: 0,
                scope: {
                    condition: "LIKE",
                    value: scope.scopeId
                }
            }
        }))

        const res = await Promise.allSettled(scopesPromise);

        return resSuccess(res.map((item, idx) => {
            if (item.status === "fulfilled") {
                return {
                    scopeId: scopes[idx].scopeId,
                    scopeName: scopes[idx].scopeName,
                    count: item.value.data
                }
            } else {
                return {
                    scopeId: scopes[idx].scopeId,
                    scopeName: scopes[idx].scopeName,
                    count: item.reason
                }
            }
        }))
    }
}

export default IndexService;