import config from '../../config/config';

Page({
  data: {
    bannerList: [],
    recommendList: [],
    categoryList: [],
    cartCount: 0,
    animating: false,
    animImage: '',
    animStyle: ''
  },
  onLoad() {
    this.getBanner();
    this.getRecommend();
    this.getCategoryGoods();
  },
  getBanner() {
    wx.request({
      url: config.apiBaseUrl + '/banner/list',
      success: res => {
        if (res.data.code === 0) {
          this.setData({ bannerList: res.data.data });
        }
      }
    });
  },
  getRecommend() {
    wx.request({
      url: config.apiBaseUrl + '/goods/recommend',
      success: res => {
        if (res.data.code === 0) {
          // 打印推荐商品完整数据
          console.log('推荐商品数据:', res.data.data);
          this.setData({ recommendList: res.data.data });
        }
      }
    });
  },
  getCategoryGoods() {
    wx.request({
      url: config.apiBaseUrl + '/category/home',
      success: res => {
        if (res.data.code === 0) {
          // 打印分类商品完整数据
          console.log('分类商品数据:', res.data.data);
          this.setData({ categoryList: res.data.data });
        }
      }
    });
  },
  addToCart(e) {
    const goodsId = e.currentTarget.dataset.id;
    const imgUrl = e.currentTarget.dataset.img;
    // 1. 获取商品图片的坐标
    const query = wx.createSelectorQuery();
    query.select(`#goods-img-${goodsId}`).boundingClientRect();
    query.exec(res => {
      const from = res[0];
      // 购物车TabBar角标大致在屏幕底部偏右上方，适当微调
      wx.getSystemInfo({
        success: sys => {
          const to = {
            left: sys.windowWidth * 0.62, // 更靠右，贴近小红点
            top: sys.windowHeight - 46    // 更靠上，贴近小红点
          };
          if (from) {
            this.setData({
              animating: true,
              animImage: imgUrl,
              animStyle: `left:${from.left}px;top:${from.top}px;`
            });
            setTimeout(() => {
              this.setData({
                animStyle: `left:${to.left}px;top:${to.top}px;transform:scale(0.2);opacity:0;`
              });
              setTimeout(() => {
                const newCount = this.data.cartCount + 1;
                this.setData({
                  animating: false,
                  animImage: '',
                  animStyle: '',
                  cartCount: newCount
                });
                wx.setTabBarBadge({
                  index: 2,
                  text: String(newCount)
                });
              }, 700);
            }, 20);
          } else {
            // fallback: 直接加数量
            const newCount = this.data.cartCount + 1;
            this.setData({ cartCount: newCount });
            wx.setTabBarBadge({
              index: 2,
              text: String(newCount)
            });
          }
        }
      });
    });
    wx.showToast({ title: '加入购物车', icon: 'success' });
  },
  goCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/category/category?id=${categoryId}` });
  }
}); 