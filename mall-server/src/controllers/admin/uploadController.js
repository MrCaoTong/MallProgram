const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../../../config/config.development.js'); // 可根据环境自动切换

// 确保上传目录存在
const uploadDir = config.uploadDir ? path.join(__dirname, '../../../', config.uploadDir) : path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 上传控制器
exports.uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '没有上传文件' });
  }
  // 返回可访问的URL
  const fileUrl = `${config.uploadDir ? '/' + config.uploadDir.replace(/\\/g, '/') : '/uploads'}/${req.file.filename}`;
  res.json({
    code: 200,
    message: '上传成功',
    data: {
      url: fileUrl
    }
  });
};

// 暴露multer实例以便在路由中使用
exports.uploadMiddleware = upload.single('file'); 