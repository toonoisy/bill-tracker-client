import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import { TabBar } from "zarm";
import CustomIcon from "../CustomIcon";
import s from "./style.module.less";

const NavBar = ({ showNav }) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(location.pathname);
  const navigateTo = useNavigate();

  useEffect(() => {
    setActiveKey(location.pathname);
  }, [location.pathname]);

  const changeTab = (path) => {
    setActiveKey(path);
    navigateTo(path);
  };

  return (
    <TabBar
      className={s.NavBar}
      visible={showNav}
      activeKey={activeKey}
      onChange={changeTab}
    >
      <TabBar.Item
        itemKey="/"
        title="账单"
        icon={<CustomIcon type="zhangdan" size="md" />}
      />
      <TabBar.Item
        itemKey="/stats"
        title="统计"
        icon={<CustomIcon type="tongji" size="md" />}
      />
      <TabBar.Item
        itemKey="/user"
        title="我的"
        icon={<CustomIcon type="wode" size="md" />}
      />
    </TabBar>
  );
};

NavBar.propTypes = {
  showNav: PropTypes.bool,
};

export default NavBar;
