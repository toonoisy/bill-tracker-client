import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/hooks';
import { setIsInit } from '@/store/billSlice';
import { NavBar, Icon } from 'zarm';
import s from './style.module.less';

interface DetailHeaderProps {
  title: string;
}

const DetailHeader = ({ title }: DetailHeaderProps) => {
  const navigateTo = useNavigate();
  const dispatch = useAppDispatch();

  const back = () => {
    navigateTo(-1);
    dispatch(setIsInit(true));
  };

  return (
    <div className={s.headerWrap}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => back()}
            />
          }
          title={title}
        />
      </div>
    </div>
  );
};

export default DetailHeader;
