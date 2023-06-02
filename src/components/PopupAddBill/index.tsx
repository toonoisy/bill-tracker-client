import React, { useState, useRef, forwardRef, useEffect } from 'react';
import { Popup, Icon, Toast, Keyboard, Input } from 'zarm';
import cx from 'classnames';
import dayjs from 'dayjs';
import CustomIcon from '../CustomIcon';
import PopupDate from '../PopupDate';
import { useAppSelector } from '@/hooks';
import { PAY_TYPES, typeIconMap } from '@/constants';
import s from './style.module.less';
import request from '@/utils/request';
import { BillDetail } from '@/types';

interface PopupAddBillProps {
  detail?: BillDetail;
  onReload: () => void;
}

interface CurrentHandlers extends HTMLElement {
  show?: () => void;
  close?: () => void;
}

interface PopupAddBillItem {
  id?: number;
  pay_type: number;
  amount: string;
  date: string;
  type_id: number;
  remark: string | undefined;
}

type Methods = 'head' | 'options' | 'put' | 'post' | 'patch' | 'delete' | 'get';

const PopupAddBill = forwardRef<HTMLElement, PopupAddBillProps>(
  ({ detail = {}, onReload }, ref) => {
    const { expenseTagList, incomeTagList } = useAppSelector(
      (store) => store.category
    );
    const dateRef = useRef<HTMLElement | null>(null);
    const [show, setShow] = useState(false);
    const [showRemarkInput, setShowRemarkInput] = useState(false);
    const [payType, setPayType] = useState(PAY_TYPES.EXPENSE);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [typeId, setTypeId] = useState(0);
    const [remark, setRemark] = useState<string | undefined>('');

    const detailId: number | undefined = detail?.id;

    useEffect(() => {
      if (!detailId) {
        setTypeId(expenseTagList[0]?.id);
      }
    }, [expenseTagList]);

    useEffect(() => {
      if (detailId) {
        setPayType(detail.pay_type as number);
        setAmount(detail.amount as string);
        setDate(detail.date as string);
        setTypeId(detail.type_id as number);
        setRemark(detail.remark as string);
      }
    }, [detail]);

    const billItem = async () => {
      let method: Methods = 'post';
      const params: PopupAddBillItem = {
        date,
        type_id: typeId,
        pay_type: payType,
        amount,
        remark,
      };
      if (detailId) {
        params.id = detailId;
        method = 'put';
      }
      const res = await request[method]('/api/bill/item', params);
      setShow(false);
      Toast.show(res.msg);
      resetParams();
      onReload && onReload();
    };

    const resetParams = () => {
      setPayType(PAY_TYPES.EXPENSE);
      setAmount('');
      setDate(dayjs().format('YYYY-MM-DD'));
      setTypeId(expenseTagList[0]?.id);
      setRemark('');
    };

    const changePayType = (type: number) => {
      setPayType(type);
      if (type === PAY_TYPES.EXPENSE) {
        setTypeId(expenseTagList[0]?.id);
      } else {
        setTypeId(incomeTagList[0]?.id);
      }
    };

    const onDateSelect = (val: string) => {
      setDate(val);
    };

    const onKeyboardChange = (val: string | undefined) => {
      if (val === 'ok') {
        if (amount.endsWith('.')) {
          setAmount(amount.slice(0, -1));
        }
        billItem();
        return;
      }
      if (val === '.' && amount.includes('.')) return;
      if (val === 'delete') {
        setAmount(amount.slice(0, -1));
        return;
      }
      setAmount(amount + val);
    };

    const togglePopupDate = () => {
      const current = dateRef.current as CurrentHandlers;
      current?.show && current.show();
    };

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

    return (
      <Popup
        visible={show}
        direction="bottom"
        onMaskClick={() => setShow(false)}
        destroy={false}
        mountContainer={() => document.body}
      >
        <div className={s.addWrap}>
          {/* 右上角关闭弹窗 */}
          <header className={s.header}>
            <span
              className={s.close}
              onClick={() => setShow(false)}
            >
              <Icon type="wrong" />
            </span>
          </header>
          {/* 「收入」和「支出」类型切换 */}
          <div className={s.filter}>
            <div className={s.type}>
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
            <div
              className={s.time}
              onClick={togglePopupDate}
            >
              {dayjs(date).format('MM-DD')}
              <Icon
                className={s.arrow}
                type="arrow-bottom"
              />
            </div>
          </div>
          <div className={s.money}>
            <span className={s.sufix}>¥</span>
            <span className={s.amount}>{amount}</span>
          </div>
          <div className={s.typeWrap}>
            <div className={s.typeBody}>
              {/* 通过 payType 判断，是展示收入账单类型，还是支出账单类型 */}
              {(payType == PAY_TYPES.EXPENSE
                ? expenseTagList
                : incomeTagList
              ).map((item) => (
                <div
                  onClick={() => setTypeId(item.id)}
                  key={item.id}
                  className={s.typeItem}
                >
                  {/* 收入和支出的字体颜色，以及背景颜色通过 payType 区分，并且设置高亮 */}
                  <span
                    className={cx({
                      [s.iconfontWrap]: true,
                      [s.expense]: payType == PAY_TYPES.EXPENSE,
                      [s.income]: payType == PAY_TYPES.INCOME,
                      [s.active]: typeId == item.id,
                    })}
                  >
                    <CustomIcon
                      className={s.iconfont}
                      type={
                        typeIconMap[item.id as keyof typeof typeIconMap].icon
                      }
                    />
                  </span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={s.remark}>
            {showRemarkInput ? (
              <Input
                autoHeight
                showLength
                autoFocus
                maxLength={50}
                type="text"
                rows={3}
                value={remark}
                placeholder="请输入备注信息"
                onChange={(val?: string) => setRemark(val)}
                onBlur={() => setShowRemarkInput(false)}
              />
            ) : (
              <span onClick={() => setShowRemarkInput(true)}>
                {remark || '添加备注'}
              </span>
            )}
          </div>
          <Keyboard
            type="price"
            onKeyClick={(value?: string | undefined) => onKeyboardChange(value)}
          />
          <PopupDate
            ref={dateRef}
            onSelect={onDateSelect}
          />
        </div>
      </Popup>
    );
  }
);

PopupAddBill.displayName = 'PopupAddBill';

export default PopupAddBill;
