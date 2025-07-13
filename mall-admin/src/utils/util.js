// 通用工具函数，可按需补充
 
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleString();
} 

// 处理图片 URL，将相对路径直接返回
export function getImageUrl(relativePath) {
  console.log('getImageUrl called with:', relativePath);
  if (!relativePath) return '';
  // 如果已经是完整的 URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    console.log('getImageUrl return (as is):', relativePath);
    return relativePath;
  }
  // 直接返回相对路径
  console.log('getImageUrl return (相对路径):', relativePath);
  return relativePath;
} 