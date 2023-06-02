import React, { useEffect, useState } from 'react';
import { Cell } from 'zarm';
import { useNavigate } from 'react-router-dom';
import CustomIcon from '../CustomIcon';
import { typeIconMap } from '@/constants';
import s from './style.module.less';
import { useAppSelector } from '@/hooks';
import { Bill } from '@/types';

const PAY_TYPES = {
  EXPENSE: 1,
  INCOME: 2,
};

interface DayItemProps {
  item: Bill;
}

const DayItem = ({ item }: DayItemProps) => {
  const { categoryList } = useAppSelector((store) => store.category);
  const [expense, setExpense] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  useEffect(() => {
    const calc = (payType: string) => {
      return item.bills.reduce((acc, cur) => {
        if (cur.pay_type === PAY_TYPES[payType as keyof typeof PAY_TYPES]) {
          acc += Number(cur.amount);
        }
        return acc;
      }, 0);
    };
    setExpense(calc('EXPENSE'));
    setIncome(calc('INCOME'));
  }, [item.bills]);

  const navigateTo = useNavigate();
  const goToDetail = (id: number) => {
    navigateTo(`/detail?id=${id}`);
  };

  return (
    <div className={s.item}>
      <div className={s.headerDate}>
        <div className={s.date}>{item.date}</div>
        <div className={s.money}>
          <span>
            <img
              src="//s.yezgea02.com/1615953405599/zhi%402x.png"
              alt="支"
            />
            <span>¥{expense.toFixed(2)}</span>
          </span>
          <span>
            <img
              src="//s.yezgea02.com/1615953405599/shou%402x.png"
              alt="收"
            />
            <span>¥{income.toFixed(2)}</span>
          </span>
        </div>
      </div>
      {/* `Cannot assign to read only property '0' of object '[object Array]'` */}
      {item.bills
        ?.slice()
        .sort((a, b) => Number(b.ctime) - Number(a.ctime))
        .map((e) => (
          <Cell
            className={s.bill}
            key={e.id}
            onClick={() => goToDetail(e.id)}
            title={
              <>
                <CustomIcon
                  className={s.itemIcon}
                  type={typeIconMap[e.type_id as keyof typeof typeIconMap].icon}
                />
                <span>
                  {categoryList?.find((c) => c.id === e.type_id)?.name}
                </span>
              </>
            }
            description={
              <span
                style={{
                  color: e.pay_type == PAY_TYPES.INCOME ? 'red' : '#39be77',
                }}
              >{`${e.pay_type == PAY_TYPES.INCOME ? '+' : '-'}${Number(
                e.amount
              ).toFixed(2)}`}</span>
            }
            help={<div>{e.remark || ''}</div>}
          />
        ))}
    </div>
  );
};

export default DayItem;
