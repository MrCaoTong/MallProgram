// 通用工具函数，可按需补充
 
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString();
} 