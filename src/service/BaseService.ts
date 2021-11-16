import { BaseServiceImpl, GetProps, ListProps, AddProps, PutProps, DelProps, CountProps } from "./BaseServiceImpl";
import { pool } from "@/utils/mysql";
import { insert, select, update, count, detele } from "@/utils/sql";
import { fieldFilterFormat, resSuccess, resSuccessPage } from "@/utils/common";
import { v4 as uuidv4 } from "uuid";
import { Response } from "@/types/IData";
import { Table } from "@/types/table";

class BaseService implements BaseServiceImpl {

    tableName?: Table | "" = "";

    async count(props: CountProps): Promise<Response<number>> {

        if (this.tableName && !props.table) props.table = this.tableName;

        let { sql, key } = count(props);
        var [totalCountRes]: any = await pool.query(sql);
        const totalCount = totalCountRes && totalCountRes[0][key];
        return resSuccess(totalCount);
    }
    async get<T extends object>(props: GetProps): Promise<Response<T>> {

        if (this.tableName && !props.table) props.table = this.tableName;

        const sql = select(props);
        var [res]: any = await pool.query(sql);
        return resSuccess(res[0] as T)
    }
    async list<T>(props: ListProps): Promise<Response<T[]>> {

        if (this.tableName && !props.table) props.table = this.tableName;

        const page = Boolean(props.pageIndex && props.pageSize);

        // 查询总条数
        let totalCount = 0;
        if (page) {
            let { sql, key } = count(props);
            var [totalCountRes]: any = await pool.query(sql);
            totalCount = totalCountRes && totalCountRes[0][key];
        }

        const sql = select(props);
        var [res] = await pool.query(sql);

        return page
            ? resSuccessPage(res as T[], {
                current: props.pageIndex,
                totalNum: totalCount,
                totalPage: Math.ceil(totalCount / props.pageSize),
                size: props.pageSize
            })
            : resSuccess(res as T[])
    }
    async add<T extends object>(props: AddProps<T>): Promise<Response<T>> {

        if (this.tableName && !props.table) props.table = this.tableName;

        // 过滤数据
        let data: any = fieldFilterFormat(props.table, props.data)

        const id = uuidv4().replace(/-/g, "");
        data.id = id;

        const sql = insert({ table: props.table, data });
        await pool.query(sql);

        return resSuccess(data)
    }
    async put<T extends object>(props: PutProps<T>): Promise<Response<T>> {

        if (this.tableName && !props.table) props.table = this.tableName;

        if (!Reflect.has(props, "table")) throw new Error("缺少 table！");

        // 过滤数据
        let data: T = fieldFilterFormat(props.table, props.data)

        // @ts-ignore
        const sql = update({ ...props, data });

        await pool.query(sql);

        return resSuccess(data)
    }
    async del(props: DelProps) {

        if (this.tableName && !props.table) props.table = this.tableName;

        const dbData = { is_delete: 1 };
        return await this.put({
            ...props,
            data: dbData
        })
    }
    async remove(props: DelProps) {

        if (this.tableName && !props.table) props.table = this.tableName;

        const sql = detele(props.table, props.where);

        var [res] = await pool.query(sql);
        return resSuccess(res)
    }
}

export default BaseService;