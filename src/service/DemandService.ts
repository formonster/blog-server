import { Response } from '@/types/IData';
import { resSuccess } from '@/utils/common';
import { yearAgo, monthAgo, ms2m } from '@/utils/date';
import { Where } from '@/utils/sql';
import BaseService from './BaseService';
import DemandServiceImpl, { ScopeCountProps, ScopeCountRes } from './DemandServiceImpl'

const TABLE_NAME = "thtt_xuqiu";

class IndexService extends BaseService implements DemandServiceImpl {
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
    async scopeCountRegion(scopes: ScopeCountProps, regionId: number, regionLevel: number): Promise<Response<ScopeCountRes>> {

        if (!scopes.length) return Promise.resolve(resSuccess([]));

        const regionField = {
            1: "province",
            2: "city",
            3: "county"
        }[regionLevel]

        const scopesPromise = scopes.map(scope => this.count({
            table: TABLE_NAME,
            leftJoin: {
                table: "thtt_organization",
                on: `thtt_organization.organization_id = ${TABLE_NAME}.unit`,
            },
            where: {
                [`${TABLE_NAME}.is_delete`]: 0,
                [`${TABLE_NAME}.scope`]: {
                    condition: "LIKE",
                    value: scope.scopeId
                },
                [`thtt_organization.${regionField}`]: regionId
            },
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
    async scopeYearAddCount(scopes: ScopeCountProps, where?: Where): Promise<Response<ScopeCountRes>> {

        if (!scopes.length) return Promise.resolve(resSuccess([]));

        const scopesPromise = scopes.map(scope => this.count({
            table: TABLE_NAME,
            where: {
                ...where,
                is_delete: 0,
                scope: {
                    condition: "LIKE",
                    value: scope.scopeId
                },
                add_time: {
                    condition: ">",
                    value: ms2m(yearAgo())
                },
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
    async scopeYearAddCountRegion(scopes: ScopeCountProps, regionId: number, regionLevel: number): Promise<Response<ScopeCountRes>> {

        if (!scopes.length) return Promise.resolve(resSuccess([]));

        const regionField = {
            1: "province",
            2: "city",
            3: "county"
        }[regionLevel]

        const scopesPromise = scopes.map(scope => this.count({
            table: TABLE_NAME,
            leftJoin: {
                table: "thtt_organization",
                on: `thtt_organization.organization_id = ${TABLE_NAME}.unit`,
            },
            where: {
                [`${TABLE_NAME}.is_delete`]: 0,
                [`${TABLE_NAME}.scope`]: {
                    condition: "LIKE",
                    value: scope.scopeId
                },
                [`thtt_organization.${regionField}`]: regionId,
                [`${TABLE_NAME}.add_time`]: {
                    condition: ">",
                    value: ms2m(yearAgo())
                },
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