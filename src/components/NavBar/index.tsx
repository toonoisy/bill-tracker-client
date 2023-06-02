import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/hooks';
import { setIsInit } from '@/store/billSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'zarm';
import CustomIcon from '../CustomIcon';
import s from './style.module.less';

interface NavBarProps {
  showNav: boolean;
}

const NavBar = ({ showNav }: NavBarProps) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState<string>(location.pathname);
  const navigateTo = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  // Explicitly set the type of tabBarProps for ts to infer
  const tabBarProps = {
    className: s.NavBar,
    visible: showNav,
    activeKey: activeKey,
    onChange: (value?: string | number) => {
      setActiveKey(value as string);
      navigateTo(value as string);
      dispatch(setIsInit(true));
    },
  };

  return (
    <TabBar {...tabBarProps}>
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={
          <CustomIcon
            type="zhangdan"
            size="md"
          />
        }
      />
      <TabBar.Item
        itemKey="/stats"
        title="统计"
        icon={
          <CustomIcon
            type="tongji"
            size="md"
          />
        }
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={
          <CustomIcon
            type="wode"
            size="md"
          />
        }
      />
    </TabBar>
  );
};

export default NavBar;
