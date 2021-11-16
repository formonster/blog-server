import mysql from "mysql2/promise";
import config from "@/config/db";

// 创建连接池
export const pool = mysql.createPool(config.connectionConfig);