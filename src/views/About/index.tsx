import React from 'react';
import { Button } from 'zarm';
import DetailHeader from '@/components/DetailHeader';
import s from './style.module.less';

const About = () => {
  return (
    <div className={s.about}>
      <DetailHeader title="关于" />
      <article>
        <p>Hi, 这是一个 React H5 练习项目</p>
        <Button
          href="https://github.com/toonoisy/bill-tracker-client"
          target="_blank"
          block
          theme="primary"
        >
          仓库地址
        </Button>
        <Button
          href="https://github.com/toonoisy/bill-tracker-server"
          target="_blank"
          block
          theme="primary"
        >
          配套后端仓库地址
        </Button>
        <Button
          href="https://juejin.cn/book/6966551262766563328"
          target="_blank"
          block
          theme="primary"
        >
          鸣谢
        </Button>
      </article>
    </div>
  );
};

export default About;
