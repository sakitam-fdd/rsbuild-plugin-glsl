import { useEffect } from 'react';
import { useLocation, Outlet } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  /** 页面切换的时候触发 */
  useEffect(() => {
    console.log('切换页面', location.pathname, location.pathname?.search);
  }, [location.pathname, location.pathname?.search]);

  return <Outlet></Outlet>;
};

export default Layout;
