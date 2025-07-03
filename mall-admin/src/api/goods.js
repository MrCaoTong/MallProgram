import service from './index';
import { getCategories } from './category';

export function getGoods(params) {
  return service({
    url: '/admin/goods/list',
    method: 'get',
    params
  });
}

export function addGoods(data) {
  return service({
    url: '/admin/goods/add',
    method: 'post',
    data
  });
}

export function updateGoods(data) {
  return service({
    url: '/admin/goods/update',
    method: 'post',
    data
  });
}

export function deleteGoods(id) {
  return service({
    url: '/admin/goods/delete',
    method: 'post',
    data: { id }
  });
}

export function updateGoodsStatus(id, status) {
  return service({
    url: '/admin/goods/status',
    method: 'post',
    data: { id, status }
  });
}

export function batchUpdateGoodsStatus(ids, status) {
    return service({
      url: '/admin/goods/batch-status',
      method: 'post',
      data: { ids, status }
    });
  }

export function updateRecommend(data) {
  return service({
    url: '/admin/goods/recommend',
    method: 'post',
    data
  });
} 