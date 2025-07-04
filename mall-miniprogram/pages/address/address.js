Page({
  data: {
    addressList: []
  },
  onShow() {
    this.getAddressList();
  },
  getAddressList() {
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: 'http://localhost:4000/api/address/list',
      method: 'GET',
      data: { openid },
      success: res => {
        if (res.data.code === 0) {
          this.setData({ addressList: res.data.data });
        }
      }
    });
  },
  setDefault(e) {
    const { id } = e.currentTarget.dataset;
    const openid = wx.getStorageSync('openid');
    wx.request({
      url: 'http://localhost:4000/api/address/setDefault',
      method: 'POST',
      data: { openid, id },
      success: res => {
        if (res.data.code === 0) {
          wx.showToast({ title: '设置成功', icon: 'success' });
          this.getAddressList();
        }
      }
    });
  },
  deleteAddress(e) {
    const { id } = e.currentTarget.dataset;
    wx.showModal({
      title: '提示',
      content: '确定要删除该地址吗？',
      success: modalRes => {
        if (modalRes.confirm) {
          wx.request({
            url: 'http://localhost:4000/api/address/delete',
            method: 'POST',
            data: { id },
            success: res => {
              if (res.data.code === 0) {
                wx.showToast({ title: '删除成功', icon: 'success' });
                this.getAddressList();
              }
            }
          });
        }
      }
    });
  },
  editAddress(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/address/edit?id=${id}` });
  },
  addAddress() {
    wx.navigateTo({ url: '/pages/address/edit' });
  }
}); 