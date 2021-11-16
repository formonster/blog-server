import 'module-alias/register'
import fs from 'fs'
import path from 'path'
import { pool } from '@/utils/mysql';
import { getAllTableBySchema, TableModel, getTableColumns } from '@/utils/sql';
import dbConfig from '@/config/db';

var tableDesign: any = {};
// 通过正则指定包含哪些表
const include = /^thtt_/

start();

async function start() {

    // 查询所有表
    const sql = getAllTableBySchema(dbConfig.connectionConfig.database);
    const [res]: any = await pool.query(sql);

    // 过滤出所有表名
    const tableNames: string[] = res.map(({ table_name }: TableModel) => table_name)

    for (const name of tableNames) {

        // 过滤
        // if (!dbConfig.tableInclude.test(name)) continue;

        console.log(name);

        const [columns] = await pool.query(getTableColumns(name));
        tableDesign[name] = columns;
    }

    fs.writeFileSync(path.join(__dirname, "../../src/config/table.json"), JSON.stringify(tableDesign));

    process.exit();
}
