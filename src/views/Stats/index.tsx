import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { Icon, Progress } from 'zarm';
import cx from 'classnames';
import { typeIconMap } from '@/constants';
import CustomIcon from '@/components/CustomIcon';
import PopupDate from '@/components/PopupDate';
import { getStatsList, setDate, setPayType } from '@/store/statsSlice';
import { PAY_TYPES } from '@/constants';
import s from './style.module.less';
import { ECharts, EChartOption } from 'echarts';
import { StatsItem } from '@/types';

interface CurrentHandlers extends HTMLElement {
  show?: () => void;
  close?: () => void;
}

let pieChart: ECharts | null = null;

const Stats = () => {
  const dispatch = useAppDispatch();
  const statsDateRef = useRef<HTMLElement>(null);
  const { categoryList } = useAppSelector((store) => store.category);
  const { statsList, date, payType, totalExpense, totalIncome } =
    useAppSelector((store) => store.stats);
  const [targetDataList, setTargetDataList] = useState<StatsItem[]>([]);
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getStatsList());
    return () => {
      // 每次组件卸载的时候，需要释放图表实例。clear 只是将其清空不会释放。
      pieChart?.dispose();
    };
  }, [date, payType]);

  useEffect(() => {
    setTargetDataList(statsList.filter((e) => e.pay_type === payType));
  }, [payType, statsList]);

  useEffect(() => {
    targetDataList.length && pieChartFn(targetDataList);
  }, [targetDataList]);

  const pieChartFn = (data: StatsItem[]) => {
    if (window.echarts) {
      pieChart = echarts?.init(chartRef?.current as HTMLDivElement);
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          data: data.map(
            (item) => categoryList.find((c) => c.id === item.type_id)?.name
          ),
        },
        series: [
          {
            name: '支出',
            type: 'pie',
            radius: '55%',
            data: data.map((item) => {
              return {
                value: item.total_amount,
                name: categoryList.find((c) => c.id === item.type_id)?.name,
              };
            }),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      } as EChartOption);
    }
  };

  // 月份弹窗开关
  const togglePopupDate = () => {
    const current = statsDateRef.current as CurrentHandlers;
    current?.show && current?.show();
  };

  const selectMonth = (val: string) => {
    dispatch(setDate(val));
  };

  const changePayType = (val: number) => {
    dispatch(setPayType(val));
  };

  return (
    <div className={s.data}>
      <div className={s.total}>
        <div
          className={s.time}
          onClick={togglePopupDate}
        >
          <span>{date}</span>
          <Icon
            className={s.date}
            type="date"
          />
        </div>
        <div className={s.title}>共支出</div>
        <div className={s.expense}>¥{totalExpense}</div>
        <div className={s.income}>共收入 ¥{totalIncome}</div>
      </div>
      <div className={s.structure}>
        <div className={s.head}>
          <span className={s.title}>收支构成</span>
          <div className={s.tab}>
            <span
              onClick={() => changePayType(PAY_TYPES.EXPENSE)}
              className={cx({
                [s.expense]: true,
                [s.active]: payType == PAY_TYPES.EXPENSE,
              })}
            >
              支出
            </span>
            <span
              onClick={() => changePayType(PAY_TYPES.INCOME)}
              className={cx({
                [s.income]: true,
                [s.active]: payType == PAY_TYPES.INCOME,
              })}
            >
              收入
            </span>
          </div>
        </div>
        <div className={s.content}>
          {targetDataList.map((e) => (
            <div
              key={e.type_id}
              className={s.item}
            >
              <div className={s.left}>
                <div className={s.type}>
                  <span
                    className={cx(
                      payType === PAY_TYPES.EXPENSE ? s.expense : s.income
                    )}
                  >
                    <CustomIcon
                      type={
                        typeIconMap[e.type_id as keyof typeof typeIconMap]?.icon
                      }
                    />
                  </span>
                  <span className={s.name}>
                    {categoryList.find((c) => c.id === e.type_id)?.name}
                  </span>
                </div>
                <div className={s.progress}>
                  ¥{Number(e.total_amount)?.toFixed(2) || 0}
                </div>
              </div>
              <div className={s.right}>
                <div className={s.percent}>
                  <Progress
                    shape="line"
                    percent={Number(
                      (
                        (Number(e.total_amount) /
                          Number(
                            payType == PAY_TYPES.EXPENSE
                              ? totalExpense
                              : totalIncome
                          )) *
                        100
                      ).toFixed(2)
                    )}
                    theme="primary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={s.proportion}>
          <div
            id="proportion"
            ref={chartRef}
          ></div>
        </div>
      </div>
      <PopupDate
        ref={statsDateRef}
        mode="month"
        onSelect={selectMonth}
      />
    </div>
  );
};

export default Stats;
