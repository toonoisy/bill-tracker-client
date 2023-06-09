import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { Button, FilePicker, Input, Toast } from 'zarm';
import DetailHeader from '@/components/DetailHeader';
import request from '@/utils/request';
import { getUserInfo, setSignature, uploadAvatar } from '@/store/userSlice';
import s from './style.module.less';
import { IFileDetail } from 'zarm/lib/file-picker';

const UserInfo = () => {
  const dispatch = useAppDispatch();
  const navigateTo = useNavigate();
  const { avatar, signature, userId } = useAppSelector((store) => store.user);

  useEffect(() => {
    if (userId) return;
    dispatch(getUserInfo());
  }, []);

  const onFileChange = async (val?: object | object[]) => {
    const file = val as IFileDetail;
    if (file && file.file.size > 200 * 1024) {
      Toast.show('上传头像不得超过 200 KB');
      return;
    }
    dispatch(uploadAvatar(file.file));
  };

  const saveUserInfo = async () => {
    const params = { avatar, signature };
    const res = await request.post('/api/user/edit_userinfo', params);
    Toast.show(res?.msg);
    navigateTo(-1);
  };

  return (
    <>
      <DetailHeader title="用户信息" />
      <div className={s.userinfo}>
        <h1>个人资料</h1>
        <div className={s.item}>
          <div className={s.title}>头像</div>
          <div className={s.avatar}>
            <img
              className={s.avatarUrl}
              src={avatar}
              alt=""
            />
            <div className={s.desc}>
              <span>支持 jpg、png、jpeg 格式大小 200KB 以内的图片</span>
              <FilePicker
                className={s.filePicker}
                onChange={onFileChange}
                accept="image/*"
              >
                <Button
                  className={s.upload}
                  theme="primary"
                  size="xs"
                >
                  点击上传
                </Button>
              </FilePicker>
            </div>
          </div>
        </div>
        <div className={s.item}>
          <div className={s.title}>个性签名</div>
          <div className={s.signature}>
            <Input
              clearable
              type="text"
              value={signature}
              placeholder="请输入个性签名"
              onChange={(value?: string) =>
                dispatch(setSignature(value as string))
              }
            />
          </div>
        </div>
        <Button
          onClick={saveUserInfo}
          style={{ marginTop: 50 }}
          block
          theme="primary"
        >
          保存
        </Button>
      </div>
    </>
  );
};

export default UserInfo;
