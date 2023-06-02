import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import NavBar from './components/NavBar';
import { ConfigProvider } from 'zarm';
import zhCN from 'zarm/lib/config-provider/locale/zh_CN';
const primaryColor = '#007fff';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { setIsAuth } from '@/store/userSlice';
import { getCategoryList } from '@/store/categorySlice';

function App() {
  const location = useLocation();
  const { pathname } = location;
  const navPaths = ['/', '/stats', '/user'];
  const [showNav, setShowNav] = useState(false);
  const { isAuth } = useAppSelector((store) => store.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setShowNav(navPaths.includes(pathname));
  }, [pathname]);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(getCategoryList());
      dispatch(setIsAuth(true));
    }
  }, []);

  return (
    <>
      <ConfigProvider
        primaryColor={primaryColor}
        locale={zhCN}
      >
        <AppRoutes isAuthenticated={isAuth} />
      </ConfigProvider>
      <NavBar showNav={showNav} />
    </>
  );
}

export default App;
