const Banner = require('../models/banner');

const bannerController = {
  async list(req, res) {
    const banners = await Banner.findAll();
    res.json({ code: 0, data: banners });
  }
};

module.exports = bannerController; 