const mysql = require('mysql2/promise');

// Cấu hình kết nối tới MySQL
const pool = mysql.createPool({
    host: 'mysql-26d24aff-st-7a66.c.aivencloud.com',      // Nếu bạn dùng DB Cloud thì thay bằng link host Cloud nhé
    port: '21671',
    user: 'avnadmin',           
    password: 'YOUR_PASSWORD_HERE',           
    database: 'defaultdb', // Tên cơ sở dữ liệu của bạn
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;