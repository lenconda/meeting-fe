import { Card, Checkbox, Form, Button, Input, Icon, Row, Col } from 'antd';
import React, { FormEvent } from 'react';
import { Dispatch, AnyAction } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import router from 'umi/router';
import style from './style.less';
import { ConnectState } from '@/models/connect';

interface LoginComponentProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  userLogin: {};
  submitting: boolean;
}

const LoginForm: React.FC<LoginComponentProps> = props => {
  const { getFieldDecorator } = props.form;

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();

    props.form.validateFields((err: any, values: any) => {
      props.dispatch({
        type: 'login/login',
        payload: { ...values },
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
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>使我保持登录状态</Checkbox>)}
              <section>
                <Button type="primary" loading={props.submitting} block htmlType="submit">
                  登录
                </Button>
                <a onClick={() => router.push('/user/register')}>没有账户？注册一个账户&rarr;</a>
              </section>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

const Login = Form.create({ name: 'loginForm' })(
  connect(({ login, loading }: ConnectState) => ({
    userLogin: login,
    submitting: loading.effects['login/login'],
  }))(LoginForm),
);

export default Login;
