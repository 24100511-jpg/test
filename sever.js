const express = require('express');
const db = require('./db');

const app = express();
const port = 9999;

app.use(express.json());

// 1. READ - Lấy danh sách sinh viên
app.get('/api/student', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM STUDENT');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi lấy dữ liệu', error: error.message });
    }
});
// bài tập về nhà
// 2. CREATE - Thêm sinh viên
app.post('/api/student', async (req, res) => {
    const { SID, SNAME, EMAIL, Tutor_Id = NULL } = req.body;
    try {
        const sql = 'INSERT INTO STUDENT (SID, SNAME, EMAIL, Tutor_Id) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [SID, SNAME, EMAIL, Tutor_Id]);
        res.status(201).json({ message: 'Thêm thành công!', id: result.insertId });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi thêm dữ liệu', error: error.message });
    }
});

// 3. UPDATE - Sửa sinh viên
// 3. UPDATE - Sửa sinh viên theo đúng CSDL STUDENTREG
app.put('/api/student/:id', async (req, res) => {
    const { id } = req.params; // id ở đây chính là mã SID truyền trên URL
    const { SNAME, EMAIL, Tutor_Id } = req.body; // Lấy đúng tên trường từ Body gửi lên
    
    try {
        // Câu lệnh SQL chuẩn theo bảng STUDENT và các cột SID, SNAME, EMAIL, Tutor_Id
        const sql = 'UPDATE STUDENT SET SNAME = ?, EMAIL = ?, Tutor_Id = ? WHERE SID = ?';
        
        // Sử dụng pool hoặc db (tùy theo biến bạn import) để thực thi. 
        // Dùng `Tutor_Id || null` để nếu không truyền Tutor_Id thì hệ thống tự gán NULL, tránh lỗi khóa ngoại.
        const [result] = await db.query(sql, [SNAME, EMAIL, Tutor_Id || null, id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sinh viên để cập nhật!' });
        }
        
        res.status(200).json({ message: 'Cập nhật thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi cập nhật', error: error.message });
    }
});

// 4. DELETE - Xóa sinh viên theo đúng CSDL STUDENTREG
app.delete('/api/student/:id', async (req, res) => {
    const { id } = req.params; // id ở đây chính là mã SID truyền trên URL
    
    try {
        // Thực hiện xóa dữ liệu dựa trên cột khóa chính SID của bảng STUDENT
        const [result] = await db.query('DELETE FROM STUDENT WHERE SID = ?', [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sinh viên để xóa!' });
        }
        
        res.status(200).json({ message: 'Xóa thành công!' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi xóa dữ liệu', error: error.message });
    }
});
app.listen(port, () => {
    console.log(`Server đang chạy tại port: ${port}`);
});