/*
前端图形验证码组件
- 生成随机 N 位验证码（字母+数字）
- 点击刷新
*/
import React, { useState, useEffect } from 'react';

interface CaptchaCodeProps {
  charNum: number;
  onChange: (code: string) => void;
}

const CaptchaCode = ({ charNum = 4, onChange }: CaptchaCodeProps) => {
  const range = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const w = 100;
  const h = 40;
  const strokeLen = charNum; // 干扰线数量
  const dotLen = charNum * 10; // 干扰点数量

  const [code, setCode] = useState<string>('');

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    code && onChange(code);
  }, [code]);

  const init = () => {
    const canvas = document.getElementById('captcha-code') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    // 图形背景颜色
    ctx.fillStyle = randomColor(180, 230);
    // 绘制被填充的矩形
    ctx.fillRect(0, 0, w, h);
    randomText(ctx);
    randomStroke(ctx);
    randomDot(ctx);
  };

  const randomNum = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const randomColor = (min: number, max: number) => {
    const r = randomNum(min, max);
    const g = randomNum(min, max);
    const b = randomNum(min, max);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const randomText = (ctx: CanvasRenderingContext2D) => {
    let temp = '';
    for (let i = 0; i < charNum; i++) {
      // 随机字母或数字
      const str = range[randomNum(0, range.length - 1)];
      // 随机字体大小
      const fs = randomNum(20, h);
      // 随机字体旋转度
      const deg = randomNum(-30, 30);
      ctx.font = fs + 'px sans-serif';
      // 文字基线
      ctx.textBaseline = 'top';
      // 字体颜色
      ctx.fillStyle = randomColor(h, w);
      // 保存当前状态
      ctx.save();
      // 字体位移
      ctx.translate((w / charNum) * i + 10, 15);
      // 字体旋转
      ctx.rotate((deg * Math.PI) / 180);
      // 绘制被填充的文本
      ctx.fillText(str, -10, -10);
      // 每循环一次恢复位置
      ctx.restore();
      temp += str;
    }
    setCode(temp);
  };

  const randomStroke = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < strokeLen; i++) {
      ctx.beginPath();
      ctx.moveTo(randomNum(0, w), randomNum(0, h));
      ctx.lineTo(randomNum(0, w), randomNum(0, h));
      ctx.strokeStyle = randomColor(h, w);
      ctx.closePath();
      // 绘制已定义的路径
      ctx.stroke();
    }
  };

  const randomDot = (ctx: CanvasRenderingContext2D) => {
    let temp = dotLen;
    while (temp) {
      ctx.beginPath();
      // context.arc(x,y,r,sAngle,eAngle,counterclockwise);
      // 绘制圆 sAngle = 0, eAngle = 2 * Math.PI
      ctx.arc(randomNum(0, w), randomNum(0, h), 1, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = randomColor(h, w);
      // 填充当前绘制路径
      ctx.fill();
      temp--;
    }
  };

  return (
    <canvas
      id="captcha-code"
      width={w}
      height={h}
      onClick={() => init()}
    ></canvas>
  );
};

export default CaptchaCode;
