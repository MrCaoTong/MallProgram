import Cookies from 'js-cookie';

const AdminInfoKey = 'admin_info';

export function getAdminInfoFromCookie() {
  const info = Cookies.get(AdminInfoKey);
  return info ? JSON.parse(info) : null;
}

export function setAdminInfoToCookie(adminInfo) {
  Cookies.set(AdminInfoKey, JSON.stringify(adminInfo));
}

export function removeAdminInfoFromCookie() {
  Cookies.remove(AdminInfoKey);
} 