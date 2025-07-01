import router from './router';
import store from './store';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login']; // 无需登录即可访问的页面

router.beforeEach(async(to, from, next) => {
  NProgress.start();

  const hasAdminInfo = store.state.adminInfo;

  if (hasAdminInfo) {
    if (to.path === '/login') {
      next({ path: '/admin' });
      NProgress.done();
    } else {
      next();
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
}); 