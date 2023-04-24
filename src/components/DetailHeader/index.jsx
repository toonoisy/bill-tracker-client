import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Icon } from 'zarm';
import PropTypes from 'prop-types';
import s from './style.module.less';

const DetailHeader = ({ title }) => {
  const navigateTo = useNavigate();

  return (
    <div className={s.headerWrap}>
      <div className={s.block}>
        <NavBar
          className={s.header}
          left={
            <Icon
              type="arrow-left"
              theme="primary"
              onClick={() => navigateTo(-1)}
            />
          }
          title={title}
        />
      </div>
    </div>
  );
};

DetailHeader.propTypes = {
  title: PropTypes.string,
};

export default DetailHeader;
