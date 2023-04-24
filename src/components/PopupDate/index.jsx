import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Popup, DatePicker } from 'zarm';
import dayjs from 'dayjs';

const PopupDate = forwardRef(({ onSelect, mode = 'date' }, ref) => {
  const [show, setShow] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [selectedVal, setSelectedVal] = useState(new Date());

  const selectDate = (val) => {
    setShow(false);
    if (!isChanged) return;
    setSelectedVal(val);
    if (mode === 'month') {
      onSelect(dayjs(val).format('YYYY-MM'));
    } else if (mode === 'date') {
      onSelect(dayjs(val).format('YYYY-MM-DD'));
    }
  };

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
});

PopupDate.displayName = 'PopupDate';

PopupDate.propTypes = {
  onSelect: PropTypes.func,
  mode: PropTypes.string,
};

export default PopupDate;
