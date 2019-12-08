import React, { FormEvent } from 'react';
import { ConnectState } from '@/models/connect';
import { Dispatch, AnyAction } from 'redux';
import { Form, Card, Input, DatePicker, Cascader } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { FormComponentProps } from 'antd/lib/form';
import { connect } from 'dva';
import cities from '@/assets/cities.json';

const { RangePicker } = DatePicker;

interface CreateMeetingComponentProps extends FormComponentProps {
  dispatch: Dispatch<AnyAction>;
  submitting: boolean;
}

const CreateMeetingForm: React.FC<CreateMeetingComponentProps> = props => {
  const { getFieldDecorator } = props.form;

  const handleSubmit = (e: FormEvent): void => {

  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
  };

  return (
    <PageHeaderWrapper>
      <Card>
        <Form onSubmit={handleSubmit} {...formItemLayout}>
          <Form.Item label="会议名称">
            {
              getFieldDecorator('meetingName', {
                rules: [
                  {
                    required: true,
                    message: '请输入会议名称',
                  },
                ],
              })(
                <Input type="text" />,
              )
            }
          </Form.Item>
          <Form.Item label="与会酒店">
            {
              getFieldDecorator('hotel', {
                rules: [
                  {
                    required: true,
                    message: '请输入酒店名称',
                  },
                ],
              })(
                <Input type="text" />,
              )
            }
          </Form.Item>
          <Form.Item label="会议城市">
            {
              getFieldDecorator('meetingLocation', {
                rules: [
                  {
                    required: true,
                    message: '请选择会议城市',
                  },
                ],
              })(
                <Cascader options={cities} />,
              )
            }
          </Form.Item>
          <Form.Item label="会议起迄时间">
            {
              getFieldDecorator('time', {
                rules: [
                  {
                    required: true,
                    message: '请选择会议起迄时间',
                  },
                ],
              })(
                <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />,
              )
            }
          </Form.Item>
        </Form>
      </Card>
    </PageHeaderWrapper>
  );
};

const CreateMeeting = Form.create({ name: 'createMeetingForm' })(
  connect(({ loading }: ConnectState) => ({
    submitting: loading.effects['login/login'],
  }))(CreateMeetingForm),
);

export default CreateMeeting;
