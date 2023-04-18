import React from "react";
import { useDispatch } from "react-redux";
import { setIsAuth } from "@/store/userSlice";
import { Cell, Input, Button, Toast } from "zarm";
import Form, { Field } from "rc-field-form";
import DetailHeader from "@/components/DetailHeader";
import request from "@/utils/request";
import s from "./style.module.less";

const RCFInput = (props) => {
  const { value, ...restProps } = props;
  return <Input {...restProps} value={value} />;
};

const Account = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const preSubmit = async () => {
    try {
      const val = await form.validateFields();
      onFormFinish(val);
    } catch (err) {
      Toast.show(err.errorFields[0].errors[0]);
    }
  };

  const onFormFinish = async (val) => {
    if (val) {
      if (val.newPW !== val.confirmNewPW) {
        Toast.show("新密码两次输入不一致");
        return;
      }
      const { oldPW, newPW, confirmNewPW } = val;
      const params = { oldPW, newPW, confirmNewPW };
      const res = await request.post("/api/user/reset_password", params);
      Toast.show(res?.msg);
      setTimeout(() => {
        localStorage.removeItem("token");
        dispatch(setIsAuth(false));
      }, 1000);
    }
  };

  return (
    <>
      <DetailHeader title="重置密码" />
      <div className={s.account}>
        <Form className={s.form} form={form} onFinish={onFormFinish}>
          <Cell title="原密码">
            <Field
              name="oldPW"
              rules={[{ required: true, message: "请输入原密码" }]}
            >
              <RCFInput clearable type="text" placeholder="请输入原密码" />
            </Field>
          </Cell>
          <Cell title="新密码">
            <Field
              name="newPW"
              rules={[{ required: true, message: "请输入新密码" }]}
            >
              <RCFInput clearable type="text" placeholder="请输入新密码" />
            </Field>
          </Cell>
          <Cell title="确认密码">
            <Field
              name="confirmNewPW"
              rules={[{ required: true, message: "请再此输入新密码确认" }]}
            >
              <RCFInput
                clearable
                type="text"
                placeholder="请再此输入新密码确认"
              />
            </Field>
          </Cell>
        </Form>
        <Button className={s.btn} block theme="primary" onClick={preSubmit}>
          提交
        </Button>
      </div>
    </>
  );
};

export default Account;
