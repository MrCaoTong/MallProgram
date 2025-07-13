const config = require('../config/config');

function request({ url, method = 'GET', data = {}, header = {} }) {
  // 如果url不是http开头，自动拼接apiBaseUrl
  const fullUrl = url.startsWith('http') ? url : config.apiBaseUrl + url;
  return new Promise((resolve, reject) => {
    wx.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header
      },
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

module.exports = request;
