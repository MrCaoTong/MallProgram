import service from './index';

export function getCategories(params) {
  return service({
    url: '/admin/category/list',
    method: 'get',
    params
  });
}

export function addCategory(data) {
  return service({
    url: '/admin/category/add',
    method: 'post',
    data
  });
}

export function updateCategory(data) {
  return service({
    url: '/admin/category/update',
    method: 'post',
    data
  });
}

export function deleteCategory(id) {
  return service({
    url: '/admin/category/delete',
    method: 'post',
    data: { id }
  });
}

export function updateCategoryStatus(id, status) {
    return service({
      url: '/admin/category/status',
      method: 'post',
      data: { id, status }
    });
  } 