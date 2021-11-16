import { Response } from '@/types/IData'
import { Where } from '@/utils/sql'

export type ScopeCountProps = { scopeName: string, scopeId: string }[];

export type ScopeCountRes = { count: number, scopeId: string, scopeName: string }[];

export default interface DemandServiceImpl {
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
    /**
     * 查询某些领域下的需求数量
     * @param scopes 要查询的领域
     */
    scopeCount(scopes: ScopeCountProps, where?: Where): Promise<Response<ScopeCountRes>>;
    /**
     * 查询某些领域下的需求数量
     * @param scopes 要查询的领域
     */
    scopeCountRegion(scopes: ScopeCountProps, regionId: number, regionLevel: number): Promise<Response<ScopeCountRes>>;
    /**
     * 查询某些领域下的年新增需求数量
     * @param scopes 要查询的领域
     */
    scopeYearAddCount(scopes: ScopeCountProps, where?: Where): Promise<Response<ScopeCountRes>>;
    /**
     * 查询某些领域下的年新增需求数量
     * @param scopes 要查询的领域
     */
    scopeYearAddCountRegion(scopes: ScopeCountProps, regionId: number, regionLevel: number): Promise<Response<ScopeCountRes>>;
}