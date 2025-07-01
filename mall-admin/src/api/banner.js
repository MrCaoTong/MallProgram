import service from './index';

export function getBanners(params) {
  return service({
    url: '/admin/banner/list',
    method: 'get',
    params
  });
}

export function addBanner(data) {
  return service({
    url: '/admin/banner/add',
    method: 'post',
    data
  });
}

export function updateBanner(data) {
  return service({
    url: '/admin/banner/update',
    method: 'post',
    data
  });
}

export function deleteBanner(id) {
  return service({
    url: '/admin/banner/delete',
    method: 'post',
    data: { id }
  });
}

export function updateBannerStatus(id, status) {
  return service({
    url: '/admin/banner/status',
    method: 'post',
    data: { id, status }
  });
} 