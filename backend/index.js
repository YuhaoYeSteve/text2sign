const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: '认证失败：未提供 Token' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: '认证失败：无效的 Token' });
    req.user = user;
    next();
  });
};

// 1. 用户注册
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    // 检查用户名是否已存在
    const [rows] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ error: '用户名已存在' });
    }

    // 密码加密
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 插入数据库
    const [result] = await db.execute(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username, passwordHash]
    );

    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 2. 用户登录
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }

    // 生成 Token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' } // 7天过期
    );

    res.json({
      message: '登录成功',
      token,
      username: user.username,
      apiKey: user.api_key || ''
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 3. 获取绑定的 API Key
app.get('/api_key', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT api_key FROM users WHERE id = ?', [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json({ apiKey: rows[0].api_key || '' });
  } catch (error) {
    console.error('Get API Key error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 4. 更新绑定的 API Key
app.post('/api_key', authenticateToken, async (req, res) => {
  const { apiKey } = req.body;
  try {
    await db.execute('UPDATE users SET api_key = ? WHERE id = ?', [apiKey || null, req.user.id]);
    res.json({ message: 'API Key 更新成功' });
  } catch (error) {
    console.error('Update API Key error:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // 导出用于 serverless 部署
