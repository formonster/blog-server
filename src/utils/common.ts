import { Page, Response } from '@/types/IData';
import tableDesc from "@/config/table.json";

export const resSuccess = <T>(data: T, message: string = "success"): Response<T> => {
    return { message, code: 200, data }
}

export const resWarning = <T>(message: string, code = 201, data?: T): Response<T> => {
    return { message, code, data }
}

export const resSuccessPage = <T>(data: T, page: Page): Response<T> => {
    return { message: "success", code: 200, data, page }
}
export const resError = (msg: string): Response<any> => {
    return { message: msg, code: 500, data: null }
}
/**
 * 将数据中不属于该表的数据过滤掉
 * @param fields 表结构
 * @param data 要过滤的数据
 * @returns 过滤后的数据
 */
export const fieldFilterFormat = (table: string, data: object) => {
    const catchData: any = Object.assign({}, data);
    const fields: { Type: string, Field: string }[] = (tableDesc as any)[table];
    if (!fields) throw new Error('没有找到' + table + '表的结构')
    Object.keys(data).forEach(key => {
        const find = fields.find(({ Field }) => key === Field);
        const value = catchData[key];

        // 过滤掉无效掉值
        if (value === null || value === "null") {
            delete catchData[key]
            return
        }
        if (!find)
            delete catchData[key]
        else {
            switch (true) {
                case find.Type.includes("int") && (typeof value === "string"):
                    if (value.includes(".")) catchData[key] = parseFloat(value);
                    else catchData[key] = parseInt(value);
                    break;
                case find.Type.includes("char") || find.Type.includes("varchar") || find.Type.includes("text"):
                    catchData[key] = value + "";
                    break;
            }
        }
    })

    return catchData;
}