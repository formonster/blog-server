import { Response } from '@/types/IData';
import BaseService from './BaseService';
import MatchServiceImpl, { MatchResult } from './MatchServiceImpl'
import { resError, resSuccess, resWarning } from '@/utils/common';
import { numberCode } from '@/utils/math';
import { Table } from '@/types/table';
import { checkResultError } from '@/utils/check';
import { CloudParams } from '@/model/CloudParams';
import { ListProps } from './BaseServiceImpl';

class MatchService extends BaseService implements MatchServiceImpl {

    tableName: Table = "thtt_cloud_params"

    private createMatchParams({ type, scope }: CloudParams): ListProps {

        const tableName: "chengguo" | "xuqiu" = (["chengguo", "xuqiu"] as const)[type]

        let params: ListProps = {
            table: `thtt_${tableName}`,
            leftJoin: []
        }

        const scopes = scope.split(",").filter(val => val);
        if (scopes.length) {
            if (Array.isArray(params.leftJoin)) params.leftJoin.push({
                table: `thtt_${tableName}_scope`,
                on: `thtt_${tableName}_scope.${tableName}_id = thtt_${tableName}.${tableName}_id`,
                columns: ["second_scope_id"]
            },
                {
                    table: "thtt_scope",
                    on: `thtt_${tableName}_scope.second_scope_id = thtt_scope.id`,
                    columns: ["name AS scopeName", "name_en AS scopeNameEN"]
                })
            if (Array.isArray(params.where)) params.where.push({
                [`thtt_${tableName}_scope.second_scope_id`]: scope
            })
        }

        switch (type) {
            // 成果
            case 0:
                params.columns = [`${tableName}_id AS id`, "name", "conversion_type", "unit", "complete_time", "add_time"]
                break;
            // 需求
            case 1:
                params.columns = [`${tableName}_id AS id`, "name", "type", "unit", "complete_time", "add_time"]
                break;
        }
        return params
    }

    async hasMatchParams(userId: string, type: number): Promise<Response<boolean>> {
        const res = await this.list<CloudParams>({
            table: "thtt_cloud_params",
            where: {
                user_id: userId,
                search_type: type
            }
        });

        return resSuccess(!!res.data.length);
    }
    async match(userId: string, type: number): Promise<Response<MatchResult>> {
        // 查询菜单
        const res = await this.list<CloudParams>({
            table: "thtt_cloud_params",
            where: {
                user_id: userId,
                search_type: type
            }
        });

        if (!res.data.length) return resSuccess({
            hasParams: false,
            matchResult: []
        });

        const params = this.createMatchParams(res.data[0]);
        const matchRes = await this.list(params);

        return resSuccess({
            hasParams: true,
            matchResult: matchRes.data
        });
    }
}

export default MatchService;