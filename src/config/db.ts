export default {
    connectionConfig: {
        host: 'localhost',
        port: 3306,
        user: "root",
        password: "173923zJ",
        database: "cheese",
        waitForConnections: true,
        connectionLimit: 20, //连接池连接数
        queueLimit: 0,
    },
    // 通过正则指定包含哪些表
    tableInclude: ""
}