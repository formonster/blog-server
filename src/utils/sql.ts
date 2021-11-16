import { Table } from "@/types/table";
import { isJsonString } from "@/utils/check";

export type WhereItem = {
    [key in string]: string | number | {
        table?: Table,
        mode?: "AND" | "OR",
        field?: string,
        condition: "=" | "!=" | "LIKE" | ">" | ">=" | "<" | "<=",
        value: unknown,
        arrMode?: "AND" | "OR",
    }
}
export type Where = WhereItem | Array<WhereItem | "AND" | "OR">

/**
* 创建 Where 条件语句
* @param {Array | Object} conditions Where 条件和值
* @example
* // 1. 查询 name = "1"
* createWhere({name:"1"}); //WHERE name = '1'
*
* // 2. 查询 name = "1" || name = "2"
* createWhere({name: ["1", "2"]}); // WHERE (name = '1' OR name = '2')
*
* // 3. 查询 name = "1" && sex = 18
* createWhere({name: "1", sex: 18})
* WHERE name = '1' AND sex = 18
*
* // 4. 查询 name = "1" || sex = 18
* createWhere([{name: "1"},{sez: 18}]); // WHERE (name = '1') OR (sex = 18)
*
* // 5. 查询 (name = "1" && sex = 18) || (name = "2" && sex = 20)
* createWhere([{name: "1", sez: 18},{name: "2", sez: 20}]); // WHERE (name = '1' AND sex = 18) OR (name = '2' AND sex = 20)
*
* // 6. 查询 (name = "1" || sex = 18) && height = 180 && weight = 120
* createWhere([[{ name: "1" }, { sex: 18 }], "AND", { name: "2", sex: 20 }]); // WHERE ((name = '1') OR (sex = 18)) AND (name = '2' AND sex = 20)
*
* @returns String
*/
export const createWhere = (conditions: Where) => {

    if (!conditions || JSON.stringify(conditions) === "{}" || JSON.stringify(conditions) === "[]") return "";

    if (typeof conditions === "string") {

        // 转换成对象
        const o = isJsonString(conditions);
        if (!o) throw new Error("非法的数据格式，不能解析！")
        conditions = o
    }

    if (typeof conditions === "object") {

        let sql = "WHERE ";

        const type = (value: any) => typeof value === "string" ? `'${value}'` : value;
        const createArr = (conditions: any) => `(${conditions.map(create).join(") OR (")})`
        const create = (conditions: any) => {
            if (typeof conditions === "string" && ["and", "AND"].includes(conditions.trim())) return conditions.trim();
            if (Array.isArray(conditions)) return createArr(conditions);
            let sql = "";
            Object.entries(conditions).forEach(([key, vOp]: any, i) => {
                if (typeof vOp === "object" && !Array.isArray(vOp)) {
                    let { table, field, condition = "=", value, mode = "AND", arrMode = "OR" } = vOp as any;

                    if (["IS NULL", "IS NOT NULL"].includes(condition)) {
                        sql += ` ${mode} ${key} ${condition}`;
                        return;
                    }

                    if (!value && ![0].includes(value)) throw new Error("Value 值错误")
                    if (value.includes && value.includes("[") && value.includes("]")) value = JSON.parse(value)
                    if (Array.isArray(value)) sql += (i !== 0 ? ` ${mode} (` : "(") + (value.map(value => `${table ? table + "." : ""}${field || key} ${condition} ${["LIKE", "like"].includes(condition) ? `'%${value}%'` : type(value)}`).join(` ${arrMode} `)) + ")"
                    else sql += (i !== 0 ? ` ${mode} ` : "") + `${table ? table + "." : ""}${field || key} ${condition} ${["LIKE", "like"].includes(condition) ? `'%${value}%'` : type(value)}`;
                } else {
                    if (vOp.includes && vOp.includes("[") && vOp.includes("]")) vOp = JSON.parse(vOp)
                    if (!Array.isArray(vOp)) sql += (i !== 0
                        ? ` ${sql.trim() === ""
                            ? ""
                            : "AND"} `
                        : "") + `${key} = ${type(vOp)}`
                    else {
                        if (vOp.length)
                            sql += (i !== 0 ? ` ${sql.trim() === "" ? "" : "AND"} (` : "(") + (vOp.map(value => `${key} = ${type(value)}`).join(" OR ")) + ")"
                    }
                }
            })
            if (sql.trim() === "") return "";
            return sql;
        }

        sql += Array.isArray(conditions) ? createArr(conditions) : create(conditions);
        return sql.replace(/OR \(AND\) OR/g, "AND").replace(/OR \(and\) OR/g, "AND");
    }

    return "";
}

/**
 * 排序
 * @param conditions
 */
export const createOrderBy = (conditions: any = []) => {
    if (typeof conditions === "string") conditions = JSON.parse(conditions)
    return conditions.length ? `ORDER BY ${conditions.map((item = "") => {
        if (item.includes(" ") && item.split(" ").length <= 2) return item;
        // 默认升序
        else return item + " asc"
    })}` : ""
}

/**
 * 分页
 * @param pageIndex
 * @param pageSize
 * @returns
 */
export const page = (pageIndex: number, pageSize: number) => pageIndex && pageSize ? `LIMIT ${(pageIndex - 1) * pageSize},${pageSize}` : ""

/**
 * 关联查询
 * @param options
 * @returns
 */
export const createLeftJoin = (options: any) => {
    if (typeof options === "string") options = JSON.parse(options);
    const create = ({ table, on, columns }: any) => {
        if (!table || !on) return {
            columns: "",
            leftJoin: ""
        };
        let tableName = table;
        if (table.includes(" as ")) {
            tableName = table.split(" as ")[1];
        }
        if (table.includes(" AS ")) {
            tableName = table.split(" AS ")[1];
        }
        const _columns = columns
            ? typeof columns === "string" ? JSON.parse(columns).map((item: any) => `${tableName}.${item}`).join(",") : columns.map((item: any) => `${tableName}.${item}`).join(",")
            : ""
        const _leftJoin = `LEFT JOIN ${table} ON ${on}`;
        return {
            columns: _columns,
            leftJoin: _leftJoin
        }
    }
    if (Array.isArray(options)) {
        const all = options.map(item => create(item));
        return {
            // 过滤掉 columns 为空掉项，避免 sql 出现错误
            columns: all.map(({ columns }) => columns).filter(c => c).join(","),
            leftJoin: all.map(({ leftJoin }) => leftJoin).join(" "),
        }
    } else return create(options);
}

export const select = ({ columns = ["*"], table, where = {}, order = [], pageIndex, pageSize, leftJoin = [] }: any) => {
    const hsLeftJoin = leftJoin && !(["[]", "{}"].includes(JSON.stringify(leftJoin)));
    const _leftJoin = createLeftJoin(leftJoin);
    if (typeof columns === "string") columns = JSON.parse(columns);
    const sql = `SELECT DISTINCT ${hsLeftJoin ? columns.map((item: any) => `${table}.${item}`).join(",") : columns.join(",")} ${_leftJoin.columns ? `,${_leftJoin.columns}` : ""} FROM ${table} ${_leftJoin.leftJoin} ${createWhere(where)} ${createOrderBy(order)} ${pageIndex && pageSize ? page(pageIndex, pageSize) : ""}`
    return sql;
}
export const count = ({ columns = ["*"], table, where = {}, leftJoin = [], pageKey }: any) => {
    const count = `COUNT(${pageKey ? "DISTINCT " + pageKey : "*"})`;
    const _leftJoin = createLeftJoin(leftJoin);
    if (typeof columns === "string") columns = columns.split(",");
    const sql = `SELECT ${count} FROM ${table} ${_leftJoin.leftJoin} ${createWhere(where)}`
    return { sql, key: count };
}

export const insert = ({ table, data }: any) => `INSERT INTO ${table} (${Object.keys(data).join(",")}) VALUES (${Object.values(data).map(value => {
    if ([null, undefined].includes(value)) return "NULL";
    return typeof value === "string" ? "'" + value.replace(/\n/g, "\\n").replace(/\r/g, "\\n").replace(/'/g, "\\'").trim() + "'" : value;
}).join(",")})`

export const update = ({ table, data, where }: { table: Table, data: any, where: Where }) => `UPDATE ${table} SET ${Object.keys(data).map(key => `${key}=${typeof data[key] === "string" ? `'${data[key].replace(/\n/g, "\\n").replace(/\r/g, "\\n").replace(/'/g, "\\'").trim()}'` : data[key] === undefined ? null : data[key]}`).join(",")} ${createWhere(where)}`
export const detele = (table: string, where: Where) => `DELETE FROM ${table} ${createWhere(where)}`

export const createTable = (name: string, columns: string[]) => `CREATE TABLE IF NOT EXISTS \`${name}\`(
    ${columns.join(",")}
 )ENGINE=InnoDB DEFAULT CHARSET=utf8;`

export const removeTable = (name: string) => `DROP TABLE ${name}`;
export const renameTable = ({ name, newName }: { name: string, newName: string }) => `RENAME TABLE ${name} TO ${newName}`;

type TableModelColumn = "table_schema" | "table_type" | "englne" | "version" | "row_format" | "avg_row_length" | "data_length" | "index_length" | "data_free" | "create_time" | "update_time" | "check_time" | "table_collation" | "table_name" | "table_comment";
export interface TableModel {
    table_schema: string;
    table_type: string;
    englne: string;
    version: string;
    row_format: string;
    avg_row_length: string;
    data_length: string;
    index_length: string;
    data_free: string;
    create_time: string;
    update_time: string;
    check_time: string;
    table_collation: string;
    table_name: string;
    table_comment: string;
}

/**
 * 查询某数据库的所有表信息
 * @param columns 查询字段
 * @param schema database
 * @returns sql 语句
 */
export const getAllTableBySchema = (schema: string, columns: TableModelColumn[] = ["table_schema", "table_name", "table_comment"]) => {
    return `SELECT ${columns.join(",")} FROM INFORMATION_SCHEMA.TABLES WHERE table_schema = "${schema}";`
}

export const getTableColumns = (tableName: string) => `desc ${tableName}`;

function valueType(value: string | number) {
    return typeof value === "string"
        ? `'${value.replace(/\n/g, "\\n").replace(/\r/g, "\\n").replace(/'/g, "\\'").trim()}'`
        : value === undefined ? null : value
}

// ALTER TABLE test ADD (field7 VARCHAR(100) NOT NULL DEFAULT "0" COMMENT "field5", field8 VARCHAR(100) NOT NULL COMMENT "field6");
export interface Columns {
    name: string;
    type: "INT" | "BIGINT" | "FLOAT" | "CHAR" | "VARCHAR" | "TEXT";
    length?: number;
    isNull?: 0 | 1;
    default?: string | number;
    comment?: string
}
const DEFAULT_LENGTH: any = {
    INT: 11,
    CHAR: 255,
    VARCHAR: 2000,
}
function createColumn(config: Columns) {
    let length = "";
    if (["INT", "CHAR", "VARCHAR"].includes(config.type)) {

        // 默认长度
        if (!config.length) {
            length = `(${DEFAULT_LENGTH[config.type]})`
        } else length = `(${config.length})`
    }
    let sql = config.name + " " + config.type + length;

    if (config.isNull === 0) {
        sql += " NOT NULL"
    }

    if (config.default) {
        sql += ` DEFAULT ${valueType(config.default)}`
    }

    if (config.comment) {
        sql += ` COMMENT "${config.comment}"`
    }

    return sql
}
export const addColumn = (table: string, columns: Columns[]) => {
    return `ALTER TABLE ${table} ADD (${columns.map(createColumn).join(",")});`
}
export const updateColumn = (table: string, oldName: string, column: Columns) => `ALTER TABLE ${table} CHANGE ${oldName} ${createColumn(column)};`
export const removeColumn = (table: string, column: string) => `ALTER TABLE ${table}  DROP ${column};`