import service from './index';

export function adminLogin(data) {
  return service({
    url: '/admin/login',
    method: 'post',
    data
  });
}

export function getAdminInfo() {
  return service({
    url: '/admin/info',
    method: 'get'
  });
}

export function adminLogout() {
  return service({
    url: '/admin/logout',
    method: 'post'
  });
} 