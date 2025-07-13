Page({
  data: {
    id: '',
    name: '',
    phone: '',
    region: [],
    detail: '',
    isDefault: false,
    isEdit: false
  },
  onLoad(options) {
    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      this.getAddressDetail(options.id);
    }
  },
  getAddressDetail(id) {
    wx.request({
      url: 'http://localhost:4000/api/address/list',
      method: 'GET',
      data: { id },
      success: res => {
        if (res.data.code === 0 && res.data.data.length) {
          const addr = res.data.data[0];
          this.setData({
            name: addr.receiver,
            phone: addr.phone,
            region: [addr.province, addr.city, addr.district],
            detail: addr.detail,
            isDefault: !!addr.is_default
          });
        }
      }
    });
  },
  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },
  onRegionChange(e) {
    this.setData({ region: e.detail.value });
  },
  onSwitchChange(e) {
    this.setData({ isDefault: e.detail.value });
  },
  saveAddress() {
    const { name, phone, region, detail, isDefault, isEdit, id } = this.data;
    if (!name || !phone || !region.length || !detail) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '手机号格式不正确', icon: 'none' });
      return;
    }
    const openid = wx.getStorageSync('openid');
    const url = isEdit ? 'http://localhost:4000/api/address/update' : 'http://localhost:4000/api/address/add';
    const data = {
      openid,
      receiver: name,
      phone,
      province: region[0],
      city: region[1],
      district: region[2],
      detail,
      is_default: isDefault ? 1 : 0
    };
    if (isEdit) data.id = id;
    wx.request({
      url,
      method: 'POST',
      data,
      success: res => {
        if (res.data.code === 0) {
          wx.showToast({ title: '保存成功', icon: 'success' });
          wx.navigateBack();
        }
      }
    });
  }
}); 