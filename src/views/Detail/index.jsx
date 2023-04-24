import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Toast } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import DetailHeader from '@/components/DetailHeader';
import PopupAddBill from '@/components/PopupAddBill';
import cx from 'classnames';
import request from '@/utils/request';
import { typeIconMap, PAY_TYPES } from '@/constants';
import s from './style.module.less';
import { getBillDetail } from '@/store/billSlice';

const Detail = () => {
  const dispatch = useDispatch();
  const { categoryList } = useSelector((store) => store.category);
  const { detail } = useSelector((store) => store.bill);
  const editBillRef = useRef();
  const navigateTo = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    dispatch(getBillDetail(id));
  }, [id]);

  const delDetail = async () => {
    const data = { id };
    const { msg } = await request.delete('api/bill/item', { data });
    msg && Toast.show(msg);
    // `replace: true` won't work with `-1`
    navigateTo('/', { replace: true });
  };

  const handleDelete = () => {
    Modal.confirm({
      title: '删除',
      content: '确认删除账单？',
      onOk: () => delDetail(),
    });
  };

  const handleEdit = () => {
    editBillRef.current?.show();
  };

  return (
    <div className={s.detail}>
      <DetailHeader title="账单详情" />
      {detail.id ? (
        <div className={s.card}>
          <div className={s.type}>
            {/* 通过 pay_type 属性，判断是收入或指出，给出不同的颜色*/}
            <span
              className={cx({
                [s.expense]: detail.pay_type == PAY_TYPES.EXPENSE,
                [s.income]: detail.pay_type == PAY_TYPES.INCOME,
              })}
            >
              <CustomIcon
                className={s.iconfont}
                type={detail.type_id ? typeIconMap[detail.type_id].icon : 1}
              />
            </span>
            <span>
              {categoryList.find((e) => e.id == detail.type_id)?.name}
            </span>
          </div>
          {detail.pay_type == 1 ? (
            <div className={cx(s.amount, s.expense)}>-{detail.amount}</div>
          ) : (
            <div className={cx(s.amount, s.incom)}>+{detail.amount}</div>
          )}
          <div className={s.info}>
            <div className={s.time}>
              <span>账单日期</span>
              <span>{detail.date}</span>
            </div>
            <div className={s.time}>
              <span>{detail.mtime ? '修改时间' : '记录时间'}</span>
              <span>{detail.lastModifiedTime}</span>
            </div>
            <div className={s.remark}>
              <span>备注</span>
              <span>{detail.remark || '-'}</span>
            </div>
          </div>
          <div className={s.operation}>
            <span onClick={() => handleDelete()}>
              <CustomIcon type="shanchu" />
              删除
            </span>
            <span onClick={() => handleEdit()}>
              <CustomIcon type="tianjia" />
              编辑
            </span>
          </div>
        </div>
      ) : (
        '记录不存在'
      )}
      <PopupAddBill
        ref={editBillRef}
        detail={detail}
        onReload={() => dispatch(getBillDetail(id))}
      />
    </div>
  );
};

export default Detail;
