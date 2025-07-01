import service from './index';

export function getOrders(params) {
  return service({
    url: '/admin/order/list',
    method: 'get',
    params
  });
}

export function getOrderDetail(id) {
  return service({
    url: `/admin/order/detail/${id}`,
    method: 'get'
  });
}

export function shipOrder(id) {
  return service({
    url: '/admin/order/ship',
    method: 'post',
    data: { id }
  });
} 