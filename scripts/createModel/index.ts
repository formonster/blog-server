import 'module-alias/register'
import path from 'path'
import { pool } from '@/utils/mysql'
import { firstChar2UpperCaseSplit } from '@/utils/string'
import { createAndWrite } from '@/utils/fs'
import { getAllTableBySchema, getTableColumns } from '@/utils/sql'
import {
    quicktype,
    InputData,
    jsonInputForTargetLanguage,
} from "quicktype-core";
import { RowDataPacket } from 'mysql2'
import dbConfig from '@/config/db';

function getInitValue(type: string): unknown {
    if (type.includes("int")) return 0;
    if (type.includes("char") || type.includes("varchar") || type.includes("text")) return "";
}

async function quicktypeJSON(targetLanguage: string, typeName: string, jsonString: string) {
    const jsonInput = jsonInputForTargetLanguage(targetLanguage);

    // We could add multiple samples for the same desired
    // type, or many sources for other types. Here we're
    // just making one type from one piece of sample JSON.
    await jsonInput.addSource({
        name: typeName,
        samples: [jsonString],
    });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    return await quicktype({
        inputData,
        lang: targetLanguage,
    });
}

interface TextRow extends RowDataPacket {
    table_schema: string;
    table_name: string;
    table_comment: string;
}

async function main() {

    const [tables] = await pool.query<TextRow[]>(getAllTableBySchema(dbConfig.connectionConfig.database));

    for (const table of tables as any) {

        const tableName = table.table_name;

        // 过滤
        // if (!dbConfig.tableInclude.test(tableName)) continue;

        // .slice(5)
        const modelName = firstChar2UpperCaseSplit(tableName.slice(5), "_");

        console.log(tableName, modelName);

        const [columns]: any = await pool.query(getTableColumns(tableName));
        // 创建一个对象，用于生成 typescript type
        let data: { [keyof in string]: unknown } = {};
        for (const column of columns) {
            const { Field, Type } = column as any;
            data[Field] = getInitValue(Type);
        }
        const { lines: swiftPerson } = await quicktypeJSON(
            "typescript",
            modelName,
            JSON.stringify(data)
        );
        createAndWrite(path.join(__dirname, "../../src/model/" + modelName + ".ts"), swiftPerson.join("\n"));
    }

    process.exit();
}

main();