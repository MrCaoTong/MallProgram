const request = require('../../utils/request');

Page({
  data: {
    categories: [],      // 一级分类
    filteredCategories: [], // 用于渲染分类栏
    activeIndex: 0,      // 当前选中分类索引
    goodsList: [],       // 当前分类下商品
    allGoodsList: [],    // 所有商品列表
    searchText: '',
    animating: false,
    animImage: '',
    animStyle: '',
    cartCount: 0
  },
  onLoad() {
    this.getCategories();
    this.getAllGoods();
  },
  onShow() {
    // 每次页面显示时同步购物车数量
    const cartCount = wx.getStorageSync('cartCount') || 0;
    this.setData({ cartCount });
    if (cartCount > 0) {
      wx.setTabBarBadge({ index: 2, text: String(cartCount) });
    } else {
      wx.removeTabBarBadge({ index: 2 });
    }
    // 自动切换到指定分类
    const categoryId = wx.getStorageSync('categoryId');
    if (categoryId && this.data.categories.length > 0) {
      const idx = this.data.categories.findIndex(cat => String(cat.id) === String(categoryId));
      if (idx !== -1) {
        this.setData({
          activeIndex: idx,
          filteredCategories: this.data.categories
        });
        this.getGoods(categoryId);
      }
      wx.removeStorageSync('categoryId');
    }
  },
  getCategories() {
    request({ url: '/category/list' }).then(res => {
      if (res.code === 200 && res.data.length > 0) {
        const categoryNames = res.data.map(cat => cat.name);
        console.log('分类名列表:', categoryNames);
        this.setData({
          categories: res.data,
          filteredCategories: res.data,
          activeIndex: 0
        });
        this.getGoods(res.data[0].id);
      }
    });
  },
  getAllGoods() {
    // 拉取全部商品，假设总数不会超过1000
    request({ url: '/goods/list', method: 'GET', data: { page: 1, limit: 1000 } }).then(res => {
      if (res.code === 200 || res.code === 0) {
        const goodsArr = Array.isArray(res.data) ? res.data : (res.data.items || []);
        goodsArr.forEach(item => {
          if (item.description) {
            item.description = item.description.replace(/<[^>]+>/g, '').replace(/\n/g, '\n');
          }
        });
        this.setData({ allGoodsList: goodsArr });
        console.log('allGoodsList:', this.data.allGoodsList);
        if (Array.isArray(this.data.allGoodsList) && this.data.allGoodsList.length > 0) {
          console.log('allGoodsList[0]:', this.data.allGoodsList[0]);
        }
      }
    });
  },
  onCategoryTap(e) {
    const index = e.currentTarget.dataset.index;
    const categoryId = this.data.filteredCategories[index].id;
    this.setData({ activeIndex: index });
    this.getGoods(categoryId);
  },
  getGoods(category_id) {
    request({
      url: '/category/goods',
      method: 'GET',
      data: { category_id }
    }).then(res => {
      if (res.code === 200) {
        if (Array.isArray(res.data)) {
          res.data.forEach(item => {
            // 去除 HTML 标签，仅保留纯文本描述
            if (item.description) {
              item.description = item.description.replace(/<[^>]+>/g, '').replace(/\n/g, '\n');
            }
            console.log('商品图片:', item.image);
          });
        }
        this.setData({ goodsList: res.data });
      }
    });
  },
  onSearchInput(e) {
    const searchText = e.detail.value.trim().toLowerCase();
    if (!searchText) {
      // 恢复联动：显示全部分类和当前分类商品
      this.setData({
        searchText: '',
        filteredCategories: this.data.categories,
        goodsList: this.data.goodsList // 当前分类商品
      });
      return;
    }
    let filteredCategories = this.data.categories.filter(cat =>
      cat.name && cat.name.toLowerCase().includes(searchText)
    );
    let filteredGoods = this.data.allGoodsList.filter(item =>
      (item.name && item.name.toLowerCase().includes(searchText)) ||
      (item.description && item.description.toLowerCase().includes(searchText))
    );
    // 搜索结果也去除 HTML 标签
    filteredGoods.forEach(item => {
      if (item.description) {
        item.description = item.description.replace(/<[^>]+>/g, '').replace(/\n/g, '\n');
      }
    });
    this.setData({
      searchText,
      filteredCategories,
      goodsList: filteredGoods
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
      wx.getSystemInfo({
        success: sys => {
          const to = {
            left: sys.windowWidth * 0.62,
            top: sys.windowHeight - 46
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
                let newCount = this.data.cartCount + 1;
                this.setData({
                  animating: false,
                  animImage: '',
                  animStyle: '',
                  cartCount: newCount
                });
                wx.setStorageSync('cartCount', newCount);
                wx.setTabBarBadge({
                  index: 2,
                  text: String(newCount)
                });
              }, 700);
            }, 20);
          } else {
            // fallback: 直接加数量
            let newCount = this.data.cartCount + 1;
            this.setData({ cartCount: newCount });
            wx.setStorageSync('cartCount', newCount);
            wx.setTabBarBadge({
              index: 2,
              text: String(newCount)
            });
          }
        }
      });
    });
    // 请求后端加购
    request({
      url: '/cart/add',
      method: 'POST',
      data: { goods_id: goodsId, quantity: 1 }
    }).then(res => {
      if (res.code === 200) {
        wx.showToast({ title: '已加入购物车', icon: 'success' });
      }
    });
  }
}); 