import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { Cell, Button } from 'zarm';
import { getUserInfo, setIsAuth } from '@/store/userSlice';
import s from './style.module.less';

const User = () => {
  const navigateTo = useNavigate();
  const dispatch = useAppDispatch();
  const { username, signature, avatar, userId } = useAppSelector(
    (store) => store.user
  );
  useEffect(() => {
    if (userId) return;
    dispatch(getUserInfo());
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    dispatch(setIsAuth(false));
  };

  return (
    <div className={s.user}>
      <div className={s.head}>
        <div className={s.info}>
          <span>昵称：{username}</span>
          <span>
            <img
              style={{ width: 30, height: 30, verticalAlign: '-10px' }}
              src="//s.yezgea02.com/1615973630132/geqian.png"
              alt=""
            />
            <b>{signature}</b>
          </span>
        </div>
        <img
          className={s.avatar}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          src={avatar}
          alt=""
        />
      </div>
      <div className={s.content}>
        <Cell
          hasArrow
          title="用户信息修改"
          onClick={() => navigateTo('/userinfo')}
          icon={
            <img
              style={{ width: 20, verticalAlign: '-7px' }}
              src="//s.yezgea02.com/1615974766264/gxqm.png"
              alt=""
            />
          }
        />
        <Cell
          hasArrow
          title="重置密码"
          onClick={() => navigateTo('/account')}
          icon={
            <img
              style={{ width: 20, verticalAlign: '-7px' }}
              src="//s.yezgea02.com/1615974766264/zhaq.png"
              alt=""
            />
          }
        />
        <Cell
          hasArrow
          title="关于 BillTracker"
          onClick={() => navigateTo('/about')}
          icon={
            <img
              style={{ width: 20, verticalAlign: '-7px' }}
              src="//s.yezgea02.com/1615975178434/lianxi.png"
              alt=""
            />
          }
        />
      </div>
      <Button
        className={s.logout}
        block
        theme="danger"
        onClick={logout}
      >
        退出登录
      </Button>
    </div>
  );
};

export default User;
