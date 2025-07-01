import service from './index';

export function getSalesStats() {
  return service({
    url: '/admin/stats/sales',
    method: 'get'
  });
}

export function getSalesTrend() {
  return service({
    url: '/admin/trend/sales',
    method: 'get'
  });
}

export function getHotGoods() {
  return service({
    url: '/admin/stats/hot-goods',
    method: 'get'
  });
}

export function getOrderStats() {
  return service({
    url: '/admin/stats/orders',
    method: 'get'
  });
}

export function getOrderTrend() {
  return service({
    url: '/admin/trend/orders',
    method: 'get'
  });
}

export function getConversionStats() {
  return service({
    url: '/admin/stats/conversion',
    method: 'get'
  });
}

export function getSummary() {
  return service({
    url: '/admin/summary',
    method: 'get'
  });
}

export function getDashboard() {
  return service({
    url: '/admin/dashboard',
    method: 'get'
  });
} 