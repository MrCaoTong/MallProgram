const request = require('../../utils/request');

Page({
  data: {
    isLogin: false,
    userInfo: {},
    openidReady: false
  },
  onLoad() {
    wx.login({
      success: res => {
        console.log('wx.login返回:', res);
        if (res.code) {
          console.log('wx.login code:', res.code);
          request({
            url: '/user/login',
            method: 'POST',
            data: { code: res.code }
          }).then(resp => {
            console.log('request /user/login 返回:', resp);
            if (resp.code === 0) {
              wx.setStorageSync('openid', resp.data.openid);
              this.setData({ openidReady: true });
              console.log('onLoad获取到openid:', resp.data.openid);
            } else {
              console.log('onLoad获取openid失败', resp);
            }
          }).catch(err => {
            console.log('request /user/login 失败:', err);
          });
        } else {
          console.log('wx.login未获取到code', res);
        }
      },
      fail: err => {
        console.log('wx.login失败:', err);
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
    // 只在点击登录按钮时调用微信授权
    wx.getUserProfile({
      desc: '用于完善会员资料',
      success: res => {
        console.log('getUserProfile返回', res);
        const openid = wx.getStorageSync('openid');
        request({
          url: '/user/info',
          method: 'POST',
          data: {
            openid,
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName
          }
        }).then(resp => {
          console.log('后端返回', resp);
          if (resp.code === 0) {
            wx.setStorageSync('userInfo', res.userInfo);
            this.setData({ isLogin: true, userInfo: res.userInfo });
            wx.showToast({ title: '登录成功', icon: 'success' });
          }
        }).catch(err => {
          console.log('request /user/info 失败:', err);
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