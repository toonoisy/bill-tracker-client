import React, { useState, forwardRef } from 'react';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';

interface PopupDateProps {
  onSelect: (val: string) => void;
  mode?: string;
}

interface CurrentHandlers extends HTMLElement {
  show?: () => void;
  close?: () => void;
}

const PopupDate = forwardRef<HTMLElement, PopupDateProps>(
  ({ onSelect, mode = 'date' }, ref) => {
    const [show, setShow] = useState(false);
    const [isChanged, setIsChanged] = useState(false);
    const [selectedVal, setSelectedVal] = useState(new Date());

    const selectDate = (val: Date) => {
      setShow(false);
      if (!isChanged) return;
      setSelectedVal(val);
      if (mode === 'month') {
        onSelect(dayjs(val).format('YYYY-MM'));
      } else if (mode === 'date') {
        onSelect(dayjs(val).format('YYYY-MM-DD'));
      }
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
        <div>
          <DatePicker
            visible={show}
            value={selectedVal}
            mode={mode}
            onChange={() => setIsChanged(true)}
            onOk={selectDate}
            onCancel={() => setShow(false)}
          />
        </div>
      </Popup>
    );
  }
);

PopupDate.displayName = 'PopupDate';

export default PopupDate;
