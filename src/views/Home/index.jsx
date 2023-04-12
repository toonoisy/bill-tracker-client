import React, { useEffect, useState, useRef } from "react";
import { Icon, Pull } from "zarm";
import { REFRESH_STATE, LOAD_STATE } from "@/constants";
import DayItem from "@/components/DayItem";
import CustomIcon from "@/components/CustomIcon";
import PopupCategory from "@/components/PopupCategory";
import PopupDate from "@/components/PopupDate";
import PopupAddBill from "@/components/PopupAddBill";
import dayjs from "dayjs";
import s from "./style.module.less";
import request from "@/utils/request";

const Home = () => {
  const categoryRef = useRef();
  const dateRef = useRef();
  const addBillRef = useRef();
  const [selectedCategory, setSelectedCategory] = useState({});
  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM"));
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [billList, setBillList] = useState([]);
  const [refreshing, setRefreshing] = useState(REFRESH_STATE.normal); // 下拉刷新
  const [loading, setLoading] = useState(LOAD_STATE.normal); // 上拉加载

  useEffect(() => {
    getBillList();
  }, [page, selectedDate, selectedCategory]);

  const getBillList = async () => {
    const params = {
      date: selectedDate,
      page,
      page_size: 5,
      type_id: selectedCategory?.id || "all",
    };
    const res = await request.get("/api/bill/list", { params });
    const {
      list = [],
      totalPage = 0,
      totalExpense = 0,
      totalIncome = 0,
    } = res?.data;
    if (page == 1) {
      setBillList(list);
    } else {
      setBillList(billList.concat(list));
    }
    setTotalPage(totalPage);
    setTotalExpense(totalExpense);
    setTotalIncome(totalIncome);
    setLoading(LOAD_STATE.success);
    setRefreshing(REFRESH_STATE.success);
  };

  const refreshData = () => {
    setRefreshing(REFRESH_STATE.loading);
    if (page != 1) {
      setPage(1);
    } else {
      getBillList();
    }
  };

  const loadMoreData = () => {
    if (page < totalPage) {
      setLoading(LOAD_STATE.loading);
      setPage(page + 1);
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
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setSelectedCategory(val);
  };

  const onDateSelect = (val) => {
    setRefreshing(REFRESH_STATE.loading);
    setPage(1);
    setSelectedDate(val);
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
          <div className={s.left} onClick={togglePopupCategory}>
            <span className={s.title}>
              {selectedCategory?.name || "全部类型"}
              <Icon className={s.arrow} type="arrow-bottom" />
            </span>
          </div>
          <div className={s.right}>
            <span className={s.time} onClick={togglePopupDate}>
              {selectedDate}
              <Icon className={s.arrow} type="arrow-bottom" />
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
              <DayItem item={e} key={i} />
            ))}
          </Pull>
        ) : '暂无数据'}
      </div>
      <PopupCategory ref={categoryRef} onSelect={onCategorySelect} />
      <PopupDate ref={dateRef} onSelect={onDateSelect} mode="month" />
      <PopupAddBill ref={addBillRef} onReload={refreshData} />
      <div className={s.add} onClick={togglePopupAddBill}>
        <CustomIcon type="tianjia" size="md" />
      </div>
    </div>
  );
};

export default Home;
