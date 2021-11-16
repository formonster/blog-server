import 'module-alias/register'
import fs from 'fs'
import path from 'path'
import { pool } from '@/utils/mysql';
import { getAllTableBySchema, TableModel, getTableColumns } from '@/utils/sql';
import dbConfig from '@/config/db';

// ❌ 功能还未完成
// 因为本服务是作为基础接口，不关心具体的

var tableType: string = "";
// 通过正则指定包含哪些表

start();

async function start() {

    // 查询所有表
    const sql = getAllTableBySchema(dbConfig.connectionConfig.database);
    const [res]: any = await pool.query(sql);

    // 过滤出所有表名
    const tableNames: string[] = res.map(({ table_name }: TableModel) => table_name);

    // tableType = `export type Table = "${tableNames.filter(name => dbConfig.tableInclude.test(name)).join('" | "')}"`;
    tableType = `export type Table = "${tableNames.join('" | "')}"`;

    fs.writeFileSync(path.join(__dirname, "../../src/types/table.ts"), tableType);

    process.exit();
}
