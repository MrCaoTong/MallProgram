Page({
  data: {
    isLogin: false,
    userInfo: {},
    openidReady: false
  },
  onLoad() {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: 'http://localhost:4000/api/user/login',
            method: 'POST',
            data: { code: res.code },
            success: resp => {
              if (resp.data.code === 0) {
                wx.setStorageSync('openid', resp.data.data.openid);
                this.setData({ openidReady: true });
                console.log('onLoad获取到openid:', resp.data.data.openid);
              } else {
                console.log('onLoad获取openid失败', resp.data);
              }
            }
          });
        }
      }
    });
    // 检查本地是否已登录
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({ isLogin: true, userInfo });
    }
  },
  onShow() {
    // 每次显示时同步登录状态
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ isLogin: !!userInfo, userInfo: userInfo || {} });
    console.log('onShow userInfo', this.data.userInfo);
  },
  onGetUserInfo() {
    console.log('点击登录按钮');
    const openid = wx.getStorageSync('openid');
    console.log('onGetUserInfo读取到openid:', openid);
    if (!openid) {
      wx.showToast({ title: 'openid未获取到，请稍后再试', icon: 'none' });
      return;
    }
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        console.log('getUserProfile返回', res);
        wx.request({
          url: 'http://localhost:4000/api/user/info',
          method: 'POST',
          data: {
            openid,
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          },
          success: resp => {
            console.log('后端返回', resp);
            if (resp.data.code === 0) {
              wx.setStorageSync('userInfo', res.userInfo);
              this.setData({ isLogin: true, userInfo: res.userInfo });
              console.log('setData后 userInfo', this.data.userInfo);
              wx.showToast({ title: '登录成功', icon: 'success' });
            }
          }
        });
      },
      fail: err => {
        console.log('getUserProfile失败', err);
      }
    });
  },
  logout() {
    wx.removeStorageSync('userInfo');
    this.setData({ isLogin: false, userInfo: {} });
    wx.showToast({ title: '已退出登录', icon: 'none' });
  },
  goOrder() {
    wx.navigateTo({ url: '/pages/order/order' });
  },
  goAddress() {
    wx.navigateTo({ url: '/pages/address/address' });
  }
}); 