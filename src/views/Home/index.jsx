import React, { useEffect, useState, useRef } from 'react';
import { Icon, Pull } from 'zarm';
import { REFRESH_STATE, LOAD_STATE } from '@/constants';
import DayItem from '@/components/DayItem';
import CustomIcon from '@/components/CustomIcon';
import PopupCategory from '@/components/PopupCategory';
import PopupDate from '@/components/PopupDate';
import PopupAddBill from '@/components/PopupAddBill';
import s from './style.module.less';
import { useSelector, useDispatch } from 'react-redux';
import {
  getBillList,
  setPage,
  setDate,
  setTypeId,
  setRefreshing,
  setLoading,
} from '@/store/billSlice';

const Home = () => {
  const categoryRef = useRef();
  const dateRef = useRef();
  const addBillRef = useRef();
  const dispatch = useDispatch();
  const {
    page,
    date,
    type_id,
    totalPage,
    totalExpense,
    totalIncome,
    billList,
    refreshing,
    loading,
  } = useSelector((store) => store.bill);
  const [selectedCategory, setSelectedCategory] = useState({});

  useEffect(() => {
    dispatch(getBillList());
  }, [page, date, type_id]);

  const refreshData = () => {
    dispatch(setRefreshing(REFRESH_STATE.loading));
    if (page != 1) {
      dispatch(setPage(1));
    } else {
      dispatch(getBillList());
    }
  };

  const loadMoreData = () => {
    if (page < totalPage) {
      dispatch(setLoading(LOAD_STATE.loading));
      dispatch(setPage(page + 1));
    }
  };

  const togglePopupCategory = () => {
    categoryRef.current?.show();
  };

  const togglePopupDate = () => {
    dateRef.current?.show();
  };

  const togglePopupAddBill = () => {
    addBillRef.current?.show();
  };

  const onCategorySelect = (val) => {
    dispatch(setRefreshing(REFRESH_STATE.loading));
    dispatch(setPage(1));
    setSelectedCategory(val);
    dispatch(setTypeId(val.id));
  };

  const onDateSelect = (val) => {
    dispatch(setRefreshing(REFRESH_STATE.loading));
    dispatch(setPage(1));
    dispatch(setDate(val));
  };

  return (
    <div className={s.home}>
      <div className={s.header}>
        <div className={s.dataWrap}>
          <span className={s.expense}>
            总支出：<b>¥ {totalExpense.toFixed(2)}</b>
          </span>
          <span className={s.income}>
            总收入：<b>¥ {totalIncome.toFixed(2)}</b>
          </span>
        </div>
        <div className={s.typeWrap}>
          <div
            className={s.left}
            onClick={togglePopupCategory}
          >
            <span className={s.title}>
              {selectedCategory?.name || '全部类型'}
              <Icon
                className={s.arrow}
                type="arrow-bottom"
              />
            </span>
          </div>
          <div className={s.right}>
            <span
              className={s.time}
              onClick={togglePopupDate}
            >
              {date}
              <Icon
                className={s.arrow}
                type="arrow-bottom"
              />
            </span>
          </div>
        </div>
      </div>
      <div className={s.contentWrap}>
        {billList.length ? (
          <Pull
            animationDuration={200}
            stayTime={400}
            refresh={{
              state: refreshing,
              handler: refreshData,
            }}
            load={{
              state: loading,
              distance: 200,
              handler: loadMoreData,
            }}
          >
            {billList.map((e, i) => (
              <DayItem
                item={e}
                key={i}
              />
            ))}
          </Pull>
        ) : (
          '暂无数据'
        )}
      </div>
      <PopupCategory
        ref={categoryRef}
        onSelect={onCategorySelect}
      />
      <PopupDate
        ref={dateRef}
        onSelect={onDateSelect}
        mode="month"
      />
      <PopupAddBill
        ref={addBillRef}
        onReload={refreshData}
      />
      <div
        className={s.add}
        onClick={togglePopupAddBill}
      >
        <CustomIcon
          type="tianjia"
          size="md"
        />
      </div>
    </div>
  );
};

export default Home;
