import React, { useState, useCallback, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { setIsAuth } from '@/store/userSlice';
import { Cell, Input, Button, Checkbox, Toast } from 'zarm';
import CustomIcon from '@/components/CustomIcon';
import Captcha from '@/components/CaptchaCode';
import cx from 'classnames';
import s from './style.module.less';
import request from '@/utils/request';

const Login = () => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [checked, setChecked] = useState(false);
  const [type, setType] = useState('login');

  const onCaptchaChange = useCallback((captcha: string) => {
    setCaptcha(captcha);
    console.log(captcha);
  }, []);

  const validate = () => {
    if (!username) {
      Toast.show('请输入账号');
      return false;
    }
    if (!password) {
      Toast.show('请输入密码');
      return false;
    }
    if (type === 'signup') {
      if (!code) {
        Toast.show('请输入验证码');
        return false;
      }
      if (code != captcha) {
        Toast.show('验证码错误');
        return false;
      }
      if (!checked) {
        Toast.show('您尚未勾选同意我们的协议');
        return false;
      }
    }
    return true;
  };

  const onSignup = () => {
    request
      .post('/api/user/register', {
        username,
        password,
      })
      .then((res) => {
        Toast.show(res?.msg);
        setType('login');
      });
  };

  const onLogin = () => {
    request
      .post('/api/user/login', {
        username,
        password,
      })
      .then((res) => {
        Toast.show(res?.msg);
        localStorage.setItem('token', res?.data?.token);
        dispatch(setIsAuth(true));
      });
  };

  const onSubmit = () => {
    const valid = validate();
    if (!valid) return;
    if (type === 'signup') {
      onSignup();
    } else {
      onLogin();
    }
  };

  return (
    <div className={s.login}>
      <div className={s.head} />
      <div className={s.tab}>
        <span
          className={cx({ [s.active]: type === 'login' })}
          onClick={() => setType('login')}
        >
          登录
        </span>
        <span
          className={cx({ [s.active]: type === 'signup' })}
          onClick={() => setType('signup')}
        >
          注册
        </span>
      </div>
      <div className={s.form}>
        <Cell
          icon={
            <CustomIcon
              type="zhanghao"
              size="md"
            />
          }
        >
          <Input
            clearable
            type="text"
            placeholder="请输入账号"
            onChange={(val?: string) => setUsername(val as string)}
          />
        </Cell>
        <Cell
          icon={
            <CustomIcon
              type="mima"
              size="md"
            />
          }
        >
          <Input
            clearable
            type="password"
            placeholder="请输入密码"
            onChange={(val?: string) => setPassword(val as string)}
          />
        </Cell>
        {type === 'signup' && (
          <Cell
            icon={
              <CustomIcon
                type="mima"
                size="md"
              />
            }
          >
            <Input
              clearable
              type="text"
              placeholder="请输入验证码"
              onChange={(val?: string) => setCode(val as string)}
            />
            <Captcha
              charNum={4}
              onChange={onCaptchaChange}
            />
          </Cell>
        )}
      </div>
      <div className={s.operation}>
        {type === 'signup' && (
          <div className={s.agree}>
            <Checkbox
              onChange={(ev?: ChangeEvent<HTMLInputElement>) =>
                setChecked(ev?.target.checked as boolean)
              }
            />
            <label className="text-light">
              阅读并同意<a>《BillTracker条款》</a>
            </label>
          </div>
        )}
        <Button
          block
          theme="primary"
          onClick={onSubmit}
        >
          {type === 'signup' ? '注册' : '登录'}
        </Button>
      </div>
    </div>
  );
};

export default Login;
