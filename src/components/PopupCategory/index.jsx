import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'zarm';
import cx from 'classnames';
import s from './style.module.less';
import { useSelector } from 'react-redux';

const PopupCategory = forwardRef(({ onSelect }, ref) => {
  const { expenseTagList, incomeTagList } = useSelector(
    (store) => store.category
  );
  const [show, setShow] = useState(false);
  const [activeId, setActiveId] = useState('all');

  if (ref) {
    ref.current = {
      show: () => {
        setShow(true);
      },
      close: () => {
        setShow(false);
      },
    };
  }

  const selectItem = (item) => {
    setActiveId(item.id);
    setShow(false);
    onSelect(item);
  };

  return (
    <Popup
      visible={show}
      direction="bottom"
      onMaskClick={() => setShow(false)}
      destroy={false}
      mountContainer={() => document.body}
    >
      <div className={s.popupType}>
        <div className={s.header}>
          请选择类型
          <Icon
            type="wrong"
            className={s.cross}
            onClick={() => setShow(false)}
          />
        </div>
        <div className={s.content}>
          <div
            onClick={() => selectItem({ id: 'all' })}
            className={cx({ [s.all]: true, [s.active]: activeId == 'all' })}
          >
            全部类型
          </div>
          <div className={s.title}>支出</div>
          <div className={s.expenseWrap}>
            {expenseTagList.map((item, index) => (
              <p
                key={index}
                onClick={() => selectItem(item)}
                className={cx({ [s.active]: activeId == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
          <div className={s.title}>收入</div>
          <div className={s.incomeWrap}>
            {incomeTagList.map((item, index) => (
              <p
                key={index}
                onClick={() => selectItem(item)}
                className={cx({ [s.active]: activeId == item.id })}
              >
                {item.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </Popup>
  );
});

PopupCategory.displayName = 'PopupCategory';

PopupCategory.propTypes = {
  onSelect: PropTypes.func,
};

export default PopupCategory;
