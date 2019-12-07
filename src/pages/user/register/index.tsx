import { Card, Form, Checkbox, Button, Input, Icon, Row, Col } from 'antd';
import React, { FormEvent, useState } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import router from 'umi/router';
import style from './style.less';
import { ConnectState } from '@/models/connect';

interface RegisterComponentProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
}

const RegisterForm: React.FC<RegisterComponentProps> = props => {
  const [aggreeLicensePolicy, setAgreeLicensePolicy] = useState<boolean>(false);

  const { getFieldDecorator } = props.form;

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    props.form.validateFields((err: any, values: any) => {
      props.dispatch({
        type: 'login/login',
        payload: { ...values, type: 'login' },
      });
    });
  };

  return (
    <Row className={style.login}>
      <Col xs={24} sm={14} md={10} lg={10} xl={6} xxl={5} className={style.login}>
        <Card className={style.card}>
          <Form onSubmit={handleSubmit}>
            <Form.Item>
              {getFieldDecorator('account', {
                rules: [{ required: true, message: '请输入账户名称' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
                  placeholder="账户"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{ required: true, message: '请输入昵称' }],
              })(
                <Input
                  prefix={<Icon type="smile" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
                  placeholder="昵称"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
                  type="password"
                  placeholder="密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('confirmPassword', {
                rules: [{ required: true, message: '请确认密码' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0, 0, 0, .25)' }} />}
                  type="password"
                  placeholder="确认密码"
                />,
              )}
            </Form.Item>
            <Form.Item>
              <Checkbox
                value={aggreeLicensePolicy}
                onChange={event => setAgreeLicensePolicy(event.target.value)}>
                  已同意用户协议
              </Checkbox>
              <section>
                <Button type="primary" loading={false} block htmlType="submit">
                  注册
                </Button>
                <a onClick={() => router.push('/user/login')}>&larr;返回登录页</a>
              </section>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

const Register = Form.create({ name: 'registerForm' })(
  connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['login/login'],
  }))(RegisterForm),
);

export default Register;
