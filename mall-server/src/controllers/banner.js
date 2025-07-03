const Banner = require('../models/banner');

const bannerController = {
  async list(req, res) {
    let banners = await Banner.findAll();
    // 拼接完整图片URL
    const baseUrl = req.protocol + '://' + req.get('host');
    banners = banners.map(item => ({
      ...item,
      image: item.image && !item.image.startsWith('http') ? baseUrl + item.image : item.image
    }));
    res.json({ code: 0, data: banners });
  }
};

module.exports = bannerController; 