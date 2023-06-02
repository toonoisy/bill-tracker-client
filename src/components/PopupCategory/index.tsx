import React, { forwardRef, useState } from 'react';
import { Popup, Icon } from 'zarm';
import cx from 'classnames';
import s from './style.module.less';
import { useAppSelector } from '@/hooks';

interface PopupCategoryprops {
  onSelect: (val: CategoryItem) => void;
}

interface CurrentHandlers extends HTMLElement {
  show?: () => void;
  close?: () => void;
}

interface CategoryItem {
  id: number | string;
  pay_type?: number;
  name?: string;
  en_name?: string;
  user_id?: number;
}

const PopupCategory = forwardRef<HTMLElement, PopupCategoryprops>(
  ({ onSelect }, ref) => {
    const { expenseTagList, incomeTagList } = useAppSelector(
      (store) => store.category
    );
    const [show, setShow] = useState(false);
    const [activeId, setActiveId] = useState<number | string>('all');

    if (ref != null && typeof ref !== 'function') {
      ref.current = {
        show: () => {
          setShow(true);
        },
        close: () => {
          setShow(false);
        },
      } as CurrentHandlers;
    }

    const selectItem = (item: CategoryItem) => {
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
  }
);

PopupCategory.displayName = 'PopupCategory';

export default PopupCategory;
